/**
 * Cache Manager for Repository Data
 * Implements TTL-based lazy refresh strategy
 * Features:
 * - Stale-while-revalidate pattern
 * - Automatic background refresh
 * - Graceful fallback to stale cache
 * - Error tracking and retry logic
 */

import { db } from './db';
import { RepositoryCache, RefreshLog } from './drizzle';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// TTL in hours - configurable per environment
const CACHE_TTL_HOURS = parseInt(process.env.REPO_CACHE_TTL ?? '6');
const ACTIVE_DEV_TTL_HOURS = parseInt(process.env.REPO_CACHE_ACTIVE_TTL ?? '2');

// Consider cache error-state after this many failures
const ERROR_THRESHOLD = 3;

/**
 * Repository data structure from GitHub GraphQL
 */
export interface RepoData {
	id: string;
	name: string;
	url: string;
	description: string | null;
	stars: number;
	language: string | null;
	topics: string[];
	updatedAt: string;
	color?: string;
	[key: string]: unknown;
}

/**
 * Cache options for retrieval
 */
export interface CacheOptions {
	ttlHours?: number;
	forceRefresh?: boolean;
}

/**
 * Get cached repositories for a cluster
 * Returns cached data if valid, null if cache miss or expired
 * Does NOT trigger refresh - use shouldRefreshCluster for that
 */
export async function getCachedRepositories(clusterName: string): Promise<RepoData[] | null> {
	try {
		const cache = await db
			.select()
			.from(RepositoryCache)
			.where(eq(RepositoryCache.clusterName, clusterName))
			.limit(1);

		if (!cache.length) return null;

		const record = cache[0];

		// Return cached data regardless of expiration status
		// (Caller decides whether to trigger refresh)
		return (record.rawData as RepoData[]) || null;
	} catch (error) {
		console.error(`[Cache] Error fetching for ${clusterName}:`, error);
		return null;
	}
}

/**
 * Check if cache needs refresh based on TTL
 * Uses database fetchedAt timestamp for stateless, distributed checks
 *
 * Returns true if:
 * - Cache doesn't exist
 * - Cache is older than TTL
 * - Cache has error status
 */
export async function shouldRefreshCluster(
	clusterName: string,
	ttlHours?: number
): Promise<boolean> {
	try {
		const cache = await db
			.select()
			.from(RepositoryCache)
			.where(eq(RepositoryCache.clusterName, clusterName))
			.limit(1);

		// No cache = definitely need refresh
		if (!cache.length) {
			console.log(`[Cache] No cache found for ${clusterName}, needs refresh`);
			return true;
		}

		const record = cache[0];

		// If already refreshing, prevent thundering herd
		if (record.status === 'refreshing') {
			console.log(`[Cache] ${clusterName} already refreshing, skipping`);
			return false;
		}

		// If in error state, don't refresh yet (exponential backoff would go here)
		if (record.status === 'error' && record.errorCount! >= ERROR_THRESHOLD) {
			console.log(`[Cache] ${clusterName} in error state (${record.errorCount} errors), skipping`);
			return false;
		}

		// Calculate hours since fetch
		const now = new Date();
		const hoursSinceFetch = (now.getTime() - record.fetchedAt.getTime()) / (1000 * 60 * 60);

		// Use provided TTL or default
		const effectiveTTL = ttlHours ?? CACHE_TTL_HOURS;
		const isStale = hoursSinceFetch > effectiveTTL;

		if (isStale) {
			console.log(
				`[Cache] ${clusterName} is stale (${hoursSinceFetch.toFixed(2)}h old, TTL ${effectiveTTL}h)`
			);
		}

		return isStale;
	} catch (error) {
		console.error(`[Cache] Error checking refresh for ${clusterName}:`, error);
		// On error, assume needs refresh
		return true;
	}
}

/**
 * Store repositories in cache (upsert pattern)
 * Sets fetchedAt to now and calculates expiresAt based on TTL
 */
export async function setCachedRepositories(
	clusterName: string,
	repos: RepoData[],
	ttlHours?: number
): Promise<void> {
	const now = new Date();
	const effectiveTTL = ttlHours ?? CACHE_TTL_HOURS;
	const ttlMs = effectiveTTL * 60 * 60 * 1000;
	const expiresAt = new Date(now.getTime() + ttlMs);

	try {
		// Upsert: insert if not exists, update if exists
		await db
			.insert(RepositoryCache)
			.values({
				clusterName,
				repoNames: repos.map((r) => r.name),
				rawData: repos,
				fetchedAt: now,
				expiresAt,
				status: 'ok',
				errorCount: 0,
				lastError: null,
				updatedAt: now
			})
			.onConflictDoUpdate({
				target: RepositoryCache.clusterName,
				set: {
					repoNames: repos.map((r) => r.name),
					rawData: repos,
					fetchedAt: now,
					expiresAt,
					status: 'ok',
					errorCount: 0,
					lastError: null,
					updatedAt: now
				}
			});

		console.log(
			`[Cache] Stored ${repos.length} repos for ${clusterName}, expires at ${expiresAt.toISOString()}`
		);
	} catch (error) {
		console.error(`[Cache] Error storing repos for ${clusterName}:`, error);
		throw error;
	}
}

/**
 * Mark cache as refreshing to prevent concurrent refresh attempts
 * (Thundering herd prevention)
 */
export async function startCacheRefresh(clusterName: string): Promise<void> {
	try {
		await db
			.update(RepositoryCache)
			.set({ status: 'refreshing' })
			.where(eq(RepositoryCache.clusterName, clusterName));

		console.log(`[Cache] Marked ${clusterName} as refreshing`);
	} catch (error) {
		console.error(`[Cache] Error marking ${clusterName} as refreshing:`, error);
	}
}

/**
 * Complete successful cache refresh
 */
export async function completeCacheRefresh(
	clusterName: string,
	repos: RepoData[],
	ttlHours?: number
): Promise<void> {
	const now = new Date();
	const effectiveTTL = ttlHours ?? CACHE_TTL_HOURS;
	const ttlMs = effectiveTTL * 60 * 60 * 1000;
	const expiresAt = new Date(now.getTime() + ttlMs);

	try {
		await db
			.update(RepositoryCache)
			.set({
				rawData: repos,
				repoNames: repos.map((r) => r.name),
				fetchedAt: now,
				expiresAt,
				status: 'ok',
				errorCount: 0,
				lastError: null,
				updatedAt: now
			})
			.where(eq(RepositoryCache.clusterName, clusterName));

		console.log(`[Cache] Completed refresh for ${clusterName} with ${repos.length} repos`);
	} catch (error) {
		console.error(`[Cache] Error completing refresh for ${clusterName}:`, error);
	}
}

/**
 * Record error during cache refresh
 * Increments error count, eventually marks cache as error state
 */
export async function recordCacheError(clusterName: string, error: Error): Promise<void> {
	try {
		const cache = await db
			.select()
			.from(RepositoryCache)
			.where(eq(RepositoryCache.clusterName, clusterName))
			.limit(1);

		if (!cache.length) return;

		const newErrorCount = (cache[0].errorCount ?? 0) + 1;
		const newStatus = newErrorCount >= ERROR_THRESHOLD ? 'error' : 'refreshing';

		await db
			.update(RepositoryCache)
			.set({
				status: newStatus,
				lastError: error.message,
				errorCount: newErrorCount,
				updatedAt: new Date()
			})
			.where(eq(RepositoryCache.clusterName, clusterName));

		console.error(
			`[Cache] Recorded error for ${clusterName} (count: ${newErrorCount}): ${error.message}`
		);
	} catch (dbError) {
		console.error(`[Cache] Error recording error for ${clusterName}:`, dbError);
	}
}

/**
 * Get stale data as fallback
 * Returns last known good data even if expired
 * Used for graceful degradation when GitHub is down
 */
export async function getStaleDataFallback(clusterName: string): Promise<RepoData[] | null> {
	try {
		const cache = await db
			.select()
			.from(RepositoryCache)
			.where(eq(RepositoryCache.clusterName, clusterName))
			.limit(1);

		if (!cache.length) return null;

		const record = cache[0];
		const hoursSinceFetch = (new Date().getTime() - record.fetchedAt.getTime()) / (1000 * 60 * 60);

		console.log(
			`[Cache] Returning stale fallback for ${clusterName} (${hoursSinceFetch.toFixed(2)}h old)`
		);
		return (record.rawData as RepoData[]) || null;
	} catch (error) {
		console.error(`[Cache] Error getting stale fallback for ${clusterName}:`, error);
		return null;
	}
}

/**
 * Invalidate cache for a cluster or all clusters
 * Useful for manual refresh triggers or admin operations
 */
export async function invalidateCache(clusterName?: string): Promise<void> {
	try {
		if (clusterName) {
			// Invalidate specific cluster
			await db
				.update(RepositoryCache)
				.set({
					fetchedAt: sql`now() - interval '24 hours'`,
					updatedAt: new Date()
				})
				.where(eq(RepositoryCache.clusterName, clusterName));

			console.log(`[Cache] Invalidated cache for ${clusterName}`);
		} else {
			// Invalidate all caches
			await db.update(RepositoryCache).set({
				fetchedAt: sql`now() - interval '24 hours'`,
				updatedAt: new Date()
			});

			console.log(`[Cache] Invalidated all caches`);
		}
	} catch (error) {
		console.error('Error invalidating cache:', error);
	}
}

/**
 * Log refresh attempt for monitoring and debugging
 */
export async function logRefreshAttempt(
	clusterName: string,
	outcome: 'success' | 'failure',
	data: {
		repoCount?: number;
		errorMessage?: string;
		rateLimitRemaining?: number;
		rateLimitReset?: Date;
		durationMs?: number;
	}
): Promise<void> {
	try {
		const insertData: Record<string, any> = {
			clusterName,
			repositoryCacheId: 'unknown', // TODO: pass actual cache id
			status: 'completed',
			outcome,
			itemsAttempted: data.repoCount ?? 0, // Provide a default if undefined
			apiRequestsUsed: 0, // TODO: track API usage
			retryAttempt: 0
		};

		// Conditionally add optional fields only if defined
		if (data.repoCount !== undefined) {
			insertData.repoCount = data.repoCount;
		}
		if (data.errorMessage !== undefined) {
			insertData.errorMessage = data.errorMessage;
		}
		if (data.rateLimitRemaining !== undefined) {
			insertData.rateLimitRemaining = data.rateLimitRemaining;
		}
		if (data.rateLimitReset !== undefined) {
			insertData.rateLimitReset = data.rateLimitReset;
		}
		if (data.durationMs !== undefined) {
			insertData.durationMs = data.durationMs;
		}

		await db.insert(RefreshLog).values(insertData as any);
	} catch (error) {
		console.error(`[Cache] Error logging refresh attempt:`, error);
	}
}

/**
 * Get recent refresh history for debugging
 */
export async function getRefreshHistory(
	clusterName: string,
	limit: number = 10
): Promise<(typeof RefreshLog.$inferSelect)[]> {
	try {
		return await db
			.select()
			.from(RefreshLog)
			.where(eq(RefreshLog.clusterName, clusterName))
			.orderBy(sql`attempted_at DESC`)
			.limit(limit);
	} catch (error) {
		console.error(`[Cache] Error fetching refresh history:`, error);
		return [];
	}
}

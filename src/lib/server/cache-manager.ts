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
import type { RepoData } from '$lib/types';
import type { Prisma } from '@prisma/client';
import { addYears, addHours, subDays } from 'date-fns';

// TTL in hours - configurable per environment
const CACHE_TTL_HOURS = parseInt(process.env.REPO_CACHE_TTL ?? '6');
const ACTIVE_DEV_TTL_HOURS = parseInt(process.env.REPO_CACHE_ACTIVE_TTL ?? '2');

// Consider cache error-state after this many failures
const ERROR_THRESHOLD = 3;

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
		const cache = await db.cluster.findUnique({
			where: { name: clusterName }
		});

		if (!cache) return null;

		// Return cached data regardless of expiration status
		// (Caller decides whether to trigger refresh)
		return (cache.data as unknown as RepoData[]) || null;
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
		const cache = await db.cluster.findUnique({
			where: { name: clusterName }
		});

		// No cache = definitely need refresh
		if (!cache) {
			console.log(`[Cache] No cache found for ${clusterName}, needs refresh`);
			return true;
		}

		// If already refreshing, prevent thundering herd
		if (cache.status === 'refreshing') {
			console.log(`[Cache] ${clusterName} already refreshing, skipping`);
			return false;
		}

		// If in error state, don't refresh yet (exponential backoff would go here)
		if (cache.status === 'error' && cache.errorCount >= ERROR_THRESHOLD) {
			console.log(`[Cache] ${clusterName} in error state (${cache.errorCount} errors), skipping`);
			return false;
		}

		// Calculate hours since fetch
		const now = new Date();
		const hoursSinceFetch = (now.getTime() - cache.fetchedAt.getTime()) / (1000 * 60 * 60);

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
	const expiresAt = addHours(now, effectiveTTL);

	try {
		await db.cluster.upsert({
			where: { name: clusterName },
			update: {
				repoNames: repos.map((r) => r.name),
				data: repos as any,
				fetchedAt: now,
				expiresAt,
				status: 'ok',
				errorCount: 0,
				lastError: null,
				updatedAt: now
			},
			create: {
				name: clusterName,
				repoNames: repos.map((r) => r.name),
				data: repos as any,
				fetchedAt: now,
				expiresAt,
				status: 'ok',
				errorCount: 0,
				lastError: null
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
		const now = new Date();
		const farFuture = addYears(now, 100); // 100 years

		await db.cluster.upsert({
			where: { name: clusterName },
			update: {
				status: 'refreshing',
				updatedAt: now
			},
			create: {
				name: clusterName,
				status: 'refreshing',
				repoNames: [],
				data: [],
				expiresAt: farFuture // Temporary until first real fetch
			}
		});

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
	const expiresAt = addHours(now, effectiveTTL);

	try {
		await db.cluster.upsert({
			where: { name: clusterName },
			update: {
				data: repos as any,
				repoNames: repos.map((r) => r.name),
				fetchedAt: now,
				expiresAt,
				status: 'ok',
				errorCount: 0,
				lastError: null,
				updatedAt: now
			},
			create: {
				name: clusterName,
				data: repos as any,
				repoNames: repos.map((r) => r.name),
				fetchedAt: now,
				expiresAt,
				status: 'ok',
				errorCount: 0,
				lastError: null
			}
		});

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
		const cache = await db.cluster.findUnique({
			where: { name: clusterName }
		});

		if (!cache) {
			// If it doesn't exist, create it in error state
			await db.cluster.create({
				data: {
					name: clusterName,
					status: 'error',
					lastError: error.message,
					errorCount: 1,
					repoNames: [],
					data: [],
					expiresAt: new Date()
				}
			});
			return;
		}

		const newErrorCount = (cache.errorCount ?? 0) + 1;
		const newStatus = newErrorCount >= ERROR_THRESHOLD ? 'error' : 'refreshing';

		await db.cluster.update({
			where: { name: clusterName },
			data: {
				status: newStatus,
				lastError: error.message,
				errorCount: newErrorCount
			}
		});

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
		const cache = await db.cluster.findUnique({
			where: { name: clusterName }
		});

		if (!cache) return null;

		const hoursSinceFetch = (new Date().getTime() - cache.fetchedAt.getTime()) / (1000 * 60 * 60);

		console.log(
			`[Cache] Returning stale fallback for ${clusterName} (${hoursSinceFetch.toFixed(2)}h old)`
		);
		return (cache.data as unknown as RepoData[]) || null;
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
			await db.cluster.update({
				where: { name: clusterName },
				data: {
					fetchedAt: subDays(new Date(), 1)
				}
			});

			console.log(`[Cache] Invalidated cache for ${clusterName}`);
		} else {
			// Invalidate all caches
			await db.cluster.updateMany({
				data: {
					fetchedAt: subDays(new Date(), 1)
				}
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
	// Simplified: just log to console or optionally update cluster status
	console.log(`[Refresh Log] ${clusterName} ${outcome}:`, data);
}

/**
 * Get recent refresh history for debugging
 */
export async function getRefreshHistory(clusterName: string, limit: number = 10): Promise<any[]> {
	// Simplified: no history table anymore
	return [];
}

/**
 * GitHub Batch Fetcher
 * Handles chunked requests to GitHub GraphQL API
 * Features:
 * - Per-cluster queries (not monolithic)
 * - Cache integration
 * - Error handling per cluster (graceful degradation)
 * - Rate limit tracking
 * - Parallel efficient fetching
 */

import {
	getCachedRepositories,
	shouldRefreshCluster,
	setCachedRepositories,
	startCacheRefresh,
	recordCacheError,
	getStaleDataFallback,
	logRefreshAttempt,
	type RepoData
} from './cache-manager';
import { registryConfig } from './registry-config';

const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
	console.warn('⚠️  GITHUB_TOKEN not set - GitHub API requests will be rate limited to 60/hour');
}

/**
 * Rate limit info from GitHub API response
 */
interface RateLimit {
	remaining: number;
	reset: Date;
	limit: number;
}

/**
 * GitHub GraphQL repository node
 */
interface GitHubRepo {
	id: string;
	name: string;
	url: string;
	description: string | null;
	stargazerCount: number;
	updatedAt: string;
	repositoryTopics: {
		nodes: Array<{ topic: { name: string } }>;
	};
	languages: {
		nodes: Array<{ name: string; color: string }>;
	};
}

/**
 * Fetch repositories for a single cluster from GitHub API
 * Handles caching and fallback logic
 */
async function fetchClusterFromGitHub(
	clusterName: string,
	repoNames: string[]
): Promise<{ repos: RepoData[] | null; rateLimit: RateLimit | null; error?: Error }> {
	if (!GITHUB_TOKEN) {
		throw new Error('GITHUB_TOKEN environment variable is not set');
	}

	const startTime = Date.now();

	// Build GraphQL query for specific repos
	// Using aliases to query multiple repos without pagination
	const aliases = repoNames
		.map((name, idx) => `repo${idx}: repository(owner: "potent", name: "${name}")`)
		.join(' ');

	const query = `
    query {
      ${aliases} {
        id
        name
        url
        description
        stargazerCount
        updatedAt
        repositoryTopics(first: 5) {
          nodes {
            topic {
              name
            }
          }
        }
        languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
          nodes {
            name
            color
          }
        }
      }
      rateLimit {
        limit
        remaining
        resetAt
      }
    }
  `;

	try {
		const response = await fetch(GITHUB_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${GITHUB_TOKEN}`,
				'User-Agent': 'Shipyard/1.0 (Bun)'
			},
			body: JSON.stringify({ query })
		});

		if (!response.ok) {
			throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		if (data.errors) {
			const errorMsg = data.errors[0]?.message || 'Unknown GraphQL error';
			throw new Error(`GraphQL error: ${errorMsg}`);
		}

		// Extract rate limit info
		const rateLimit: RateLimit | null = data.data.rateLimit
			? {
					limit: data.data.rateLimit.limit,
					remaining: data.data.rateLimit.remaining,
					reset: new Date(data.data.rateLimit.resetAt)
				}
			: null;

		// Map GitHub response to RepoData
		const repos: RepoData[] = [];
		repoNames.forEach((name, idx) => {
			const ghRepo = data.data[`repo${idx}`] as GitHubRepo;
			if (ghRepo) {
				repos.push({
					id: ghRepo.id,
					name: ghRepo.name,
					url: ghRepo.url,
					description: ghRepo.description,
					stars: ghRepo.stargazerCount,
					language: ghRepo.languages?.nodes?.[0]?.name || null,
					color: ghRepo.languages?.nodes?.[0]?.color,
					topics: ghRepo.repositoryTopics?.nodes?.map((t) => t.topic.name) || [],
					updatedAt: ghRepo.updatedAt
				});
			}
		});

		const durationMs = Date.now() - startTime;

		// Log successful fetch
		await logRefreshAttempt(clusterName, 'success', {
			repoCount: repos.length,
			rateLimitRemaining: rateLimit?.remaining,
			rateLimitReset: rateLimit?.reset,
			durationMs
		});

		console.log(
			`[GitHub] Fetched ${repos.length} repos for ${clusterName} in ${durationMs}ms (rate limit: ${rateLimit?.remaining}/${rateLimit?.limit})`
		);

		return { repos, rateLimit };
	} catch (error) {
		const durationMs = Date.now() - startTime;
		const err = error instanceof Error ? error : new Error(String(error));

		// Log failed fetch
		await logRefreshAttempt(clusterName, 'failure', {
			errorMessage: err.message,
			durationMs
		});

		console.error(`[GitHub] Failed to fetch ${clusterName}:`, err.message);
		return { repos: null, rateLimit: null, error: err };
	}
}

/**
 * Get repositories for a cluster - with caching and fallback
 * This is the main entry point for lazy-loaded data retrieval
 *
 * Algorithm:
 * 1. Check cache (fast local lookup)
 * 2. If cache valid → return immediately
 * 3. If cache stale → return stale data, trigger async refresh in background
 * 4. If cache miss → fetch from GitHub, store in cache
 */
export async function getRepositoriesByCluster(
	clusterName: string,
	forceRefresh: boolean = false
): Promise<{
	repos: RepoData[];
	cached: boolean;
	isStale: boolean;
	error?: Error;
}> {
	try {
		// Get cluster config
		const clusterConfig = registryConfig.groups.find((g) => g.id === clusterName);
		if (!clusterConfig) {
			return {
				repos: [],
				cached: false,
				isStale: false,
				error: new Error(`Cluster "${clusterName}" not found in registry`)
			};
		}

		const repoNames = clusterConfig.repos;

		// Step 1: Check cache
		const cached = await getCachedRepositories(clusterName);
		const needsRefresh = await shouldRefreshCluster(clusterName);

		// Cache hit and still valid
		if (cached && !needsRefresh && !forceRefresh) {
			console.log(`[Cache] Serving fresh cache for ${clusterName}`);
			return {
				repos: cached,
				cached: true,
				isStale: false
			};
		}

		// Cache hit but stale - return stale data and trigger background refresh
		if (cached && needsRefresh && !forceRefresh) {
			console.log(`[Cache] Serving stale cache for ${clusterName}, triggering background refresh`);

			// Trigger background refresh without blocking response
			// In production, this could be a queue job or background task
			refreshInBackground(clusterName, repoNames).catch((err) => {
				console.error(`[Background Refresh] Failed for ${clusterName}:`, err);
			});

			return {
				repos: cached,
				cached: true,
				isStale: true
			};
		}

		// Cache miss or force refresh - fetch from GitHub
		console.log(`[Fetch] Fetching ${clusterName} from GitHub`);

		// Mark as refreshing to prevent thundering herd
		await startCacheRefresh(clusterName);

		const { repos, rateLimit, error } = await fetchClusterFromGitHub(clusterName, repoNames);

		if (error) {
			// Failed to fetch - try stale fallback
			const staleData = await getStaleDataFallback(clusterName);
			await recordCacheError(clusterName, error);

			if (staleData) {
				console.log(`[Fallback] Using stale data for ${clusterName} after fetch error`);
				return {
					repos: staleData,
					cached: true,
					isStale: true,
					error
				};
			}

			// No cache available
			return {
				repos: [],
				cached: false,
				isStale: false,
				error
			};
		}

		if (!repos) {
			return {
				repos: [],
				cached: false,
				isStale: false,
				error: new Error('GitHub returned empty response')
			};
		}

		// Cache the fresh data
		await setCachedRepositories(clusterName, repos);

		return {
			repos,
			cached: false,
			isStale: false
		};
	} catch (error) {
		console.error(`[getRepositoriesByCluster] Unexpected error for ${clusterName}:`, error);
		return {
			repos: [],
			cached: false,
			isStale: false,
			error: error instanceof Error ? error : new Error(String(error))
		};
	}
}

/**
 * Background refresh for stale cache
 * Non-blocking, doesn't affect initial response
 */
async function refreshInBackground(clusterName: string, repoNames: string[]): Promise<void> {
	try {
		const { repos, error } = await fetchClusterFromGitHub(clusterName, repoNames);

		if (error) {
			await recordCacheError(clusterName, error);
			return;
		}

		if (repos) {
			await setCachedRepositories(clusterName, repos);
			console.log(`[Background] Successfully refreshed ${clusterName}`);
		}
	} catch (error) {
		console.error(`[Background Refresh] Error for ${clusterName}:`, error);
	}
}

/**
 * Batch fetch multiple clusters in parallel
 * Optimized for reduced latency when fetching multiple clusters
 */
export async function fetchRepositoriesBatch(
	clusterNames: string[]
): Promise<Map<string, RepoData[]>> {
	const results = new Map<string, RepoData[]>();

	// Fetch all clusters in parallel
	const promises = clusterNames.map((name) =>
		getRepositoriesByCluster(name)
			.then((result) => {
				if (result.repos.length > 0) {
					results.set(name, result.repos);
				}
			})
			.catch((err) => {
				console.error(`[Batch] Error fetching ${name}:`, err);
			})
	);

	await Promise.all(promises);

	return results;
}

/**
 * Force refresh all clusters
 * Useful for admin operations or scheduled maintenance
 */
export async function forceRefreshAllClusters(): Promise<void> {
	const clusters = registryConfig.groups.map((g) => g.id);

	console.log(`[Force Refresh] Starting refresh for ${clusters.length} clusters`);

	const promises = clusters.map((clusterName) =>
		getRepositoriesByCluster(clusterName, true)
			.then(() => console.log(`[Force Refresh] Completed ${clusterName}`))
			.catch((err) => console.error(`[Force Refresh] Failed ${clusterName}:`, err))
	);

	await Promise.all(promises);
}

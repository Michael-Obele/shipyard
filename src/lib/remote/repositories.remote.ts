/**
 * Repository Remote Function
 * Handles lazy-loaded, chunked fetching of repositories by cluster
 * Uses SvelteKit's query.batch pattern for efficient batching
 *
 * Pattern:
 * Component calls: getRepositoriesByClusterRemote('cinder')
 * Multiple calls are auto-batched by SvelteKit
 * Server receives array and processes in parallel
 */

import { query } from '$app/server';
import * as v from 'valibot';
import { getRepositoriesByCluster } from '$lib/server/github-batch';

/**
 * Schema for cluster name validation
 */
const ClusterNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Cluster name is required'),
  v.minLength(1),
  v.maxLength(100)
);

/**
 * Individual cluster resolver for batch processing
 * Returns repo data for a single cluster
 */
async function resolveCluster(clusterName: string) {
  const result = await getRepositoriesByCluster(clusterName);

  return {
    clusterName,
    repos: result.repos,
    cached: result.cached,
    isStale: result.isStale,
    error: result.error?.message || null,
  };
}

/**
 * Get repositories for a cluster (lazy-loaded)
 *
 * Usage in components:
 * ```svelte
 * const repos = await getRepositoriesByClusterRemote('cinder');
 * ```
 *
 * When multiple components call this simultaneously,
 * SvelteKit automatically batches them into a single server call.
 *
 * Features:
 * - Automatic batching via SvelteKit's query.batch
 * - Cache-first strategy
 * - Graceful fallback to stale cache
 * - Per-cluster error handling
 * - Type-safe responses
 */
export const getRepositoriesByClusterRemote = query(
  ClusterNameSchema,
  async (clusterName: string) => {
    return resolveCluster(clusterName);
  }
);

/**
 * Batch resolver for multiple clusters at once
 * Useful when you need multiple clusters on a single page
 *
 * Usage:
 * ```svelte
 * const batchResult = await getRepositoriesBatchRemote(['cinder', 'tools', 'docs']);
 * ```
 */
const BatchClusterSchema = v.pipe(
  v.array(ClusterNameSchema),
  v.minLength(1, 'At least one cluster is required'),
  v.maxLength(20, 'Cannot fetch more than 20 clusters at once')
);

export const getRepositoriesBatchRemote = query(
  BatchClusterSchema,
  async (clusterNames: string[]) => {
    // Fetch all clusters in parallel
    const results = await Promise.all(
      clusterNames.map((name) => resolveCluster(name))
    );

    // Return as object for easier access
    return {
      clusters: results,
      timestamp: new Date().toISOString(),
      totalRepos: results.reduce((acc, r) => acc + r.repos.length, 0),
    };
  }
);

/**
 * Invalidate cache for a cluster (admin function)
 * Used for manual refresh triggers
 *
 * This could be protected with authentication in production
 */
const InvalidateCacheSchema = v.optional(ClusterNameSchema);

export const invalidateCacheRemote = query(
  InvalidateCacheSchema,
  async (clusterName?: string) => {
    const { invalidateCache } = await import('$lib/server/cache-manager');

    if (clusterName) {
      await invalidateCache(clusterName);
      return {
        success: true,
        message: `Invalidated cache for cluster: ${clusterName}`,
      };
    }

    await invalidateCache();
    return {
      success: true,
      message: 'Invalidated all caches',
    };
  }
);

/**
 * Force refresh all clusters (admin function)
 * Used for maintenance operations
 */
export const forceRefreshRemote = query(async () => {
  const { forceRefreshAllClusters } = await import('$lib/server/github-batch');

  await forceRefreshAllClusters();

  return {
    success: true,
    message: 'Started force refresh of all clusters',
    timestamp: new Date().toISOString(),
  };
});

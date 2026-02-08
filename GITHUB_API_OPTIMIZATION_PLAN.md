# GitHub API Optimization Plan: SvelteKit Remote Functions + Neon DB

**Status**: Planning Document  
**Date**: February 8, 2026  
**Tech Stack**: SvelteKit 5 Remote Functions (query.batch) + Neon DB + Prisma ORM

---

## 📋 Executive Summary

We're implementing a **hybrid caching + batch fetching system** using SvelteKit's experimental `query.batch` remote functions and Neon PostgreSQL to:

1. **Reduce GitHub API calls** → Cache repository metadata in Neon DB
2. **Improve speed** → Serve cached data instantly (stale-while-revalidate pattern)
3. **Handle failures gracefully** → Fallback to stale cache if GitHub is down
4. **Batch requests** → Use `query.batch` to group simultaneous cluster fetches into one server call
5. **Progressive updates** → Background refresh keeps cache fresh without blocking user

---

## 🔴 Current Problems

### 1. **Monolithic Single Query**
- **Issue**: Current implementation fetches first 100 repos in one large GraphQL query
- **Risk**: Any network hiccup or GitHub timeout fails the entire homepage
- **Performance**: Users wait 5-10 seconds for all data before page renders

### 2. **No Caching Mechanism**
- Every homepage visit = fresh GitHub API request
- Wastes GitHub API quota (5,000 requests/hour for authenticated users)
- No fallback if GitHub is down

### 3. **All-or-Nothing Architecture**
- No partial data rendering
- No incremental loading
- One failed batch = entire page fails

### 4. **N+1 Query Problem**
- Homepage renders multiple repo components
- Each component might independently fetch data (without proper batching)
- Results in unnecessary overhead

---

## ✅ Solution Architecture

### Core Concept: Three-Layer System

```
USER REQUEST
    ↓
1. CHECK CACHE (Neon DB) - ~50ms response
   → Cache hit? Return cached data immediately
   ↓
2. IF STALE OR EXPIRED → Trigger background refresh (async, non-blocking)
   ↓
3. FETCH FROM GITHUB (in batches)
   → Use query.batch to group cluster requests
   → Split into logical groups: Cinder cluster, Docs cluster, etc.
   ↓
4. STORE IN NEON → Update cache with TTL
   ↓
5. RETURN MERGED DATA → Merge GitHub data + registry config
```

### Key Innovation: SvelteKit's query.batch

**What is `query.batch`?**
- Built into SvelteKit Remote Functions (v2.27+)
- Automatically batches multiple function calls that happen in the same macrotask
- Server receives array of inputs, returns resolver function to resolve each one
- Solves the n+1 problem without client code changes

**Example Usage**:
```typescript
// Client component calls this multiple times
const cinderRepos = await getRepositoriesByCluster('cinder');
const toolsRepos = await getRepositoriesByCluster('tools');
const docsRepos = await getRepositoriesByCluster('docs');

// SvelteKit automatically batches into ONE server call:
// Server receives: ['cinder', 'tools', 'docs']
// Server returns resolver: (clusterId) => repos for that cluster
```

### Key Innovation: Database-Driven Lazy TTL Refresh

Instead of scheduled cron jobs, we use the database itself as a refresh trigger:

**How it works**:
1. Query stores `fetchedAt` timestamp in Neon DB
2. Each request checks: `now() - cache.fetchedAt > CACHE_TTL_HOURS`?
3. **YES** → Return stale cache, spawn async GitHub fetch in background
4. **NO** → Return fresh cache, no fetch needed

**Benefits of this approach**:
- ✅ **No external services**: No cron scheduler, no external API callbacks
- ✅ **Works everywhere**: Vercel, Netlify, self-hosted, Docker — no special infra
- ✅ **Lazy refresh**: Data refreshed on-demand when needed, not on a schedule
- ✅ **Single source of truth**: Database tracks all cache state
- ✅ **Stateless**: Each request independently determines if refresh is needed
- ✅ **Easy to debug**: Just check `fetchedAt` column and do the math: `(now - fetchedAt) / 3600000 > TTL`

**Example Timeline**:
```
Hour 0:   User1 visits → Cache miss → Fetch from GitHub → Store fetchedAt=0
Hour 1:   User2 visits → fetchedAt=0, now=1h → (1-0) < 6h TTL → Return cached ✓
Hour 6.5: User3 visits → fetchedAt=0, now=6.5h → (6.5-0) > 6h TTL
          → Return stale cache immediately
          → Async refresh starts in background
          → Next visitor gets fresh data
```

### Why This Solves Our Problems

| Problem | Solution |
|---------|----------|
| **Slow loads** | Cache in Neon DB; serve instantly on cache hit (~50ms vs 5-10s) |
| **API spam** | Batch multiple cluster queries into one; TTL on cache prevents repeated fetches |
| **Failures** | Fallback to stale cache if GitHub is down; graceful degradation |
| **N+1 problem** | `query.batch` groups simultaneous calls; one server invocation handles all clusters |

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────┐
│        Shipyard Homepage Component          │
│   Calls: getRepositoriesByCluster('cinder') │
│          getRepositoriesByCluster('tools')  │
│          getRepositoriesByCluster('docs')   │
└──────────────┬──────────────────────────────┘
               │
               ↓ (SvelteKit auto-batches these)
┌──────────────────────────────────────────────┐
│  Remote Function: repositories.remote.ts    │
│  query.batch handler (server-side)          │
│  Receives: ['cinder', 'tools', 'docs']      │
└──────────────┬───────────────────────────────┘
               │
               ↓
        ┌──────────────┐
        │ Cache Check? │
        │ (Neon DB)    │
        └──────┬───────┘
               │
        ┌──────┴──────────┐
        ↓                 ↓
    CACHE HIT        CACHE MISS
   (return data)    (fetch GitHub)
        │                 │
        ├─────────────────┤
               ↓
   ┌─────────────────────────┐
   │ Fetch from GitHub GraphQL │
   │ (per-cluster queries)     │
   └──────────────┬────────────┘
                  ↓
        ┌──────────────────────┐
        │ Store in Neon Cache  │
        │ (with TTL: 2-6 hrs)  │
        └──────────────┬───────┘
                       ↓
        ┌────────────────────────────┐
        │ Return Resolver Function   │
        │ Maps each cluster to repos │
        └──────────────┬─────────────┘
                       ↓
        ┌────────────────────────────┐
        │ Merge with Registry Config │
        │ (featured, reordering, etc)│
        └──────────────┬─────────────┘
                       ↓
              Client receives data
              → Page renders
```

---

## 🗄️ Database Schema (Neon PostgreSQL + Prisma)

### New Table: `RepositoryCache`

```prisma
model RepositoryCache {
  id              String    @id @default(cuid())
  clusterName     String    @unique // e.g., "cinder", "unclustered-batch-1"
  repoNames       String[]  // JSON array: ["cinder", "cinder-sv", "cinder-mcp"]
  rawData         Json      // Full GitHub repo objects
  fetchedAt       DateTime  @default(now())
  expiresAt       DateTime  // Calculated: fetchedAt + TTL_HOURS
  status          String    @default("ok")  // ok | refreshing | error
  lastError       String?   // Error message if fetch failed
  errorCount      Int       @default(0)     // Retry counter
  updatedAt       DateTime  @updatedAt
  
  @@index([fetchedAt])
  @@index([status])
}
```

**Fields Explained**:
- `fetchedAt`: Timestamp of last successful GitHub fetch (used for TTL calculation)
- `expiresAt`: When this cache should be considered stale (for UI display)
- `status`: 
  - `ok` = valid, serve this data
  - `refreshing` = async refresh in progress, prevent thundering herd
  - `error` = fetch failed, check `lastError` and `errorCount`
- `errorCount`: Incremented on each failed refresh (useful for debugging)

### TTL Policy

TTL is checked at runtime by comparing `now() - fetchedAt` against `CACHE_TTL_HOURS`:

- **Normal clusters**: 6 hours (most stable)
- **Active development clusters**: 2 hours (Cinder, experimental projects)
- **On error**: Immediate retry (but `status: 'error'` allows detection)

**No hardcoded expiration times** — all TTL logic lives in `cache-manager.ts`.

---

## 📁 File Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── github.ts                 (MODIFY: Split into per-cluster queries)
│   │   ├── github-batch.ts           (NEW: Cluster batch fetchers)
│   │   ├── cache-manager.ts          (NEW: Neon cache layer)
│   │   ├── registry.ts               (MODIFY: Use cache + batch)
│   │   └── registry-config.ts        (existing)
│   │
│   └── remote/
│       ├── repositories.remote.ts    (NEW: query.batch remote function)
│       ├── projects.remote.ts        (MODIFY: Use repositories batch)
│       └── project.remote.ts         (existing)
│
└── routes/
    ├── +page.svelte                  (MODIFY: Uses remote function)
    └── ...
```

---

## 🛠️ Implementation Phases

### Phase 1: Database Setup (Priority: 🔴 **HIGH**)
**Goal**: Set up Neon DB and schema

- [ ] Create Neon PostgreSQL database
- [ ] Add connection string to `.env.local`
- [ ] Create Prisma schema with `RepositoryCache` and `RefreshLog` tables
- [ ] Run migration: `bun prisma migrate dev --name add_repository_cache`
- [ ] Generate Prisma client: `bun prisma generate`

**Time**: ~30 minutes

---

### Phase 2: Cache Manager (Priority: 🔴 **HIGH**)
**Goal**: Create abstraction layer for cache operations

**File**: `src/lib/server/cache-manager.ts`

```typescript
export interface CacheOptions {
  ttlHours?: number;
  forceRefresh?: boolean;
}

export async function getCachedRepositories(
  clusterName: string,
  options?: CacheOptions
): Promise<RepoData[] | null>

export async function setCachedRepositories(
  clusterName: string,
  repos: RepoData[]
): Promise<void>

export async function invalidateCache(
  clusterName?: string
): Promise<void>

export async function shouldRefreshCluster(
  clusterName: string
): Promise<boolean>

export async function getStaleDataFallback(
  clusterName: string
): Promise<RepoData[] | null>
```

**Features**:
- ✅ Check if cache is valid (not expired)
- ✅ Return stale data as fallback
- ✅ Handle cache misses gracefully
- ✅ Support TTL-based expiration

**Time**: ~45 minutes

---

### Phase 3: GitHub Batch Fetchers (Priority: 🔴 **HIGH**)
**Goal**: Replace monolithic query with cluster-based fetchers

**File**: `src/lib/server/github-batch.ts`

```typescript
export async function fetchRepositoryBatch(
  clusterNames: string[]
): Promise<Map<string, RepoData[]>>
```

**For each cluster**:
1. Check cache → use if valid
2. If cache miss → fetch from GitHub GraphQL
3. Store in cache → set TTL
4. Return map: `{ 'cinder': [...repos], 'tools': [...repos] }`

**Features**:
- ✅ Individual error handling per cluster (fail-fast on each, continue others)
- ✅ Parallel cluster fetches (Promise.all with timeout)
- ✅ Automatic cache refresh on miss
- ✅ Graceful degradation: return partial results on partial failures

**Time**: ~1 hour

---

### Phase 4: Remote Function (Priority: 🔴 **HIGH**)
**Goal**: Create type-safe query.batch remote function

**File**: `src/lib/remote/repositories.remote.ts`

```typescript
import { query } from '$app/server';
import * as v from 'valibot';
import { fetchRepositoryBatch } from '$lib/server/github-batch';

export const getRepositoriesByCluster = query.batch(
  v.string(),  // Schema: accept string cluster names
  async (clusterNames) => {
    const cached = await fetchRepositoryBatch(clusterNames);
    
    // Return resolver function
    return (clusterName: string) => cached.get(clusterName) ?? [];
  }
);
```

**Features**:
- ✅ Type-safe via Valibot schema
- ✅ Automatic batching: multiple calls → one server invocation
- ✅ Devalue serialization handles `Date` objects
- ✅ Build-in refresh via `.refresh()` method

**Time**: ~30 minutes

---

### Phase 5: Update Projects Remote Function (Priority: 🔴 **HIGH**)
**Goal**: Integrate batch repository fetching into existing projects query

**File**: `src/lib/remote/projects.remote.ts`

```typescript
import { query } from '$app/server';
import { getRegistry } from '$lib/server/registry';

export const getProjects = query(async () => {
  // This now uses batched repositories under the hood
  let projects = await getRegistry();
  projects = projects.filter((p) => new Date(p.updatedAt) >= new Date('2025-01-01'));
  return projects;
});
```

**File**: `src/lib/server/registry.ts` (MODIFY)

```typescript
export async function getRegistry(): Promise<DisplayProject[]> {
  const config = registryConfig;
  
  // Define cluster groups
  const clusterNames = [
    ...config.groups.map(g => g.id),
    'unclustered'  // Catch-all for repos not in clusters
  ];
  
  // Leverage remote function batching
  const reposByCluster = await fetchRepositoryBatch(clusterNames);
  
  // Merge with config as before
  return mergeWithConfig(reposByCluster, config);
}
```

**Time**: ~45 minutes

---

### Phase 6: Database-Driven TTL Refresh (Priority: 🟡 **MEDIUM**)
**Goal**: Lazy cache refresh using database `fetchedAt` timestamp

**Core Concept**: Instead of scheduled cron jobs, we check the database's `fetchedAt` timestamp on each request and determine if a refresh is needed.

**File**: `src/lib/server/cache-manager.ts` (MODIFY)

```typescript
const CACHE_TTL_HOURS = parseInt(process.env.REPO_CACHE_TTL ?? '6');

export async function shouldRefreshCluster(clusterName: string): Promise<boolean> {
  const cache = await db.repositoryCache.findUnique({
    where: { clusterName }
  });
  
  if (!cache) return true; // No cache, fetch fresh
  if (cache.status === 'refreshing') return false; // Already refreshing, wait
  
  const now = new Date();
  const hoursSinceFetch = (now.getTime() - cache.fetchedAt.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceFetch > CACHE_TTL_HOURS;
}

export async function startCacheRefresh(clusterName: string): Promise<void> {
  // Mark as refreshing to prevent thundering herd
  await db.repositoryCache.update({
    where: { clusterName },
    data: { status: 'refreshing' }
  });
}

export async function completeCacheRefresh(
  clusterName: string,
  repos: RepoData[]
): Promise<void> {
  const now = new Date();
  const ttlMs = CACHE_TTL_HOURS * 60 * 60 * 1000;
  const expiresAt = new Date(now.getTime() + ttlMs);
  
  await db.repositoryCache.update({
    where: { clusterName },
    data: {
      rawData: repos,
      fetchedAt: now,
      expiresAt,
      status: 'ok',
      errorCount: 0,
      lastError: null
    }
  });
}
```

**Stale-While-Revalidate Pattern**:

When a request detects expired cache:

```typescript
export async function getRepositoriesWithRefresh(clusterName: string) {
  const cache = await getCachedRepositories(clusterName);
  const needsRefresh = await shouldRefreshCluster(clusterName);
  
  if (needsRefresh && cache) {
    // Return stale cache immediately to user
    // Spawn async refresh in background (don't await)
    void refreshClusterAsync(clusterName);
  }
  
  return cache ?? [];
}

async function refreshClusterAsync(clusterName: string) {
  try {
    await startCacheRefresh(clusterName);
    const freshRepos = await fetchRepositoryBatch([clusterName]);
    await completeCacheRefresh(clusterName, freshRepos.get(clusterName) ?? []);
  } catch (error) {
    console.error(`Failed to refresh ${clusterName}:`, error);
    // Mark as failed but don't block user
    await db.repositoryCache.update({
      where: { clusterName },
      data: {
        status: 'ok', // Keep serving stale data
        errorCount: { increment: 1 },
        lastError: error.message
      }
    });
  }
}
```

**Flow Diagram**:

```
Request comes in
    ↓
Check Neon DB cache
    ↓
    ├─ Does record exist?
    │   NO → Fetch from GitHub, store in DB
    │   YES → Continue
    │
    ├─ Is status "refreshing"?
    │   YES → Return stale data, wait for refresh to complete
    │   NO → Continue
    │
    └─ Calculate: now() - fetchedAt
        ↓
        ├─ > CACHE_TTL_HOURS (e.g., 6 hours)?
        │   YES → Return STALE cache, spawn async refresh
        │   NO → Return FRESH cache
```

**Benefits**:
- ✅ No external scheduler needed (no cron, no API calls)
- ✅ Works in any environment (Vercel, Netlify, self-hosted)
- ✅ Database is single source of truth
- ✅ LAZY refresh: data refreshed on-demand when needed
- ✅ "Thundering herd" protection: `refreshing` status prevents simultaneous fetches
- ✅ Stale-while-revalidate: users never wait, always get instant response
- ✅ Easy to test and debug locally

**Time**: ~45 minutes

---

### Phase 7: Error Handling & Resilience (Priority: 🟡 **MEDIUM**)
**Goal**: Graceful degradation and user-friendly failures

**Features**:
- ✅ Retry logic with exponential backoff
- ✅ Partial success handling (some clusters fail, others succeed)
- ✅ Stale cache fallback (show old data if GitHub down)
- ✅ User messaging (badges: "Updated 6h ago", warning on stale data)
- ✅ Rate-limit tracking (respect GitHub 5,000 req/hour limit)

**Time**: ~1 hour

---

### Phase 8: Client Integration (Priority: 🟡 **MEDIUM**)
**Goal**: Update components to use remote functions

**File**: `src/routes/+page.svelte`

```svelte
<script>
  import { getRepositoriesByCluster } from '$lib/remote/repositories.remote';
  
  const cinderRepos = getRepositoriesByCluster('cinder');
  const toolsRepos = getRepositoriesByCluster('tools');
  
  // These batches automatically merge into one server call!
</script>

{#await cinderRepos}
  <Loading />
{:catch error}
  <Error message={error.message} />
{:then repos}
  <ProjectGrid {repos} />
{/await}
```

**Time**: ~30 minutes

---

### Phase 9: Optional: Stale-While-Revalidate Optimization (Priority: 🟢 **LOW**)
**Goal**: Seamless background refresh without blocking user

**Already Built Into Phase 6**: The database-driven TTL approach naturally implements stale-while-revalidate:

1. **User visits homepage**
2. **Cache check**: Is `now() - fetchedAt` > 6 hours?
3. **YES** → Return cached data immediately, spawn async refresh
4. **NO** → Return cached data
5. **Meanwhile**: Background refresh happens in parallel
6. **Next visitor** (hours later) gets fresh data

**No explicit phase needed** — it's the default behavior of database-driven TTL checking.

**Optional Enhancement** (if desired):
- Add UI badge showing cache age: "Updated 2h ago" or "Updating..."
- Add manual refresh button in admin panel: `UPDATE RepositoryCache SET fetchedAt = NOW()`
- Add WebSocket updates for real-time cache status (advanced)

**Time**: Already included in Phase 6

---

## 📈 Expected Performance Improvements

### Before (Current State)
- **First load**: 5-10 seconds (monolithic GitHub query)
- **Cache hit**: None (no caching)
- **API calls/day**: High (every visit = fresh query)
- **Reliability**: Fails completely if GitHub down

### After (With Optimization)
- **Cache hit**: ~50ms (Neon DB lookup + render)
- **Cache miss**: ~1-2 seconds (parallel batch queries)
- **API calls/day**: ~12-24 (one refresh every 2-6 hours)
- **Reliability**: Falls back to stale cache if GitHub down

### Metrics
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Initial load (cache hit)** | 5-10s | ~50ms | **98% faster** ⚡ |
| **Initial load (cache miss)** | 5-10s | 1-2s | **75% faster** ⚡ |
| **API calls per visitor** | 1/visit | 1/2hrs | **98% reduction** 📉 |
| **Uptime (GitHub down)** | 0% | 100% (stale) | **100% improvement** ✅ |

---

## 🎯 Success Criteria

- [ ] ✅ Homepage loads in <500ms on cache hit
- [ ] ✅ Batch queries reduce API overhead by 90%+
- [ ] ✅ Cache TTL prevents repeated GitHub fetches
- [ ] ✅ Stale cache fallback if GitHub is down
- [ ] ✅ Clear user messaging on data freshness
- [ ] ✅ Background refresh keeps cache warm
- [ ] ✅ Error handling doesn't break UX

---

## 🔧 Configuration & Environment Variables

### `.env.local` additions:
```bash
# Neon Database
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/shipyard"

# Cache TTL (in hours) - checked on each request
REPO_CACHE_TTL=6                      # Every 6 hours, cache is considered stale

# GitHub API
GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
```

**How it Works**:
1. On each request, we check: `now() - cache.fetchedAt > REPO_CACHE_TTL`
2. If TRUE: return stale cache, spawn async refresh in background
3. If FALSE: return fresh cache, no refresh needed
4. No external scheduler, no cron jobs required

---

## 🚀 Deployment Checklist

- [ ] Neon database provisioned
- [ ] Database migrations applied
- [ ] Prisma schema updated and generated
- [ ] Environment variables set in deployment platform
- [ ] Remote functions enabled in `svelte.config.js`
- [ ] Async component support enabled (if using await in components)
- [ ] Cache manager TTL logic tested locally
- [ ] All phases implemented and tested
- [ ] Error handling validated
- [ ] Performance benchmarks met
- [ ] Type safety verified with `bun check`
- [ ] No cron jobs or external schedulers needed ✅

---

## 📚 Technology Reference

### SvelteKit Remote Functions
- **Documentation**: `/docs/kit/remote-functions`
- **Key Feature**: `query.batch` - automatic request batching
- **Type Safety**: Valibot schema validation
- **Serialization**: Devalue (handles Date, Map, custom types)

### Neon PostgreSQL
- **Connection**: Serverless, auto-scaling, edge-optimized
- **Performance**: ~50ms cold start, <5ms warm queries
- **Billing**: Per-compute time, generous free tier

### Prisma ORM
- **Type Safety**: Generated types from schema
- **Performance**: Query optimization, connection pooling
- **Migrations**: Zero-downtime with atomic scripts

---

## ⚠️ Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **Thundering herd** (multiple requests hit expired cache) | Use database `status: 'refreshing'` flag. First request acquires lock, sets status, fetches. Others return stale data. |
| **Cache grows too large** | Add cleanup job: delete records with status 'error' older than 7 days |
| **Stale data indefinitely** | TTL-based refresh ensures data refreshed on every request after expiry |
| **Rate-limit GitHub API** | Batch queries + TTL prevent excessive GitHub calls (max ~12 per day per cluster) |
| **Race conditions** | Prisma `update` ops are atomic; status flag prevents simultaneous GitHub fetches |
| **Type safety** | Run `bun check` in CI/CD; Valibot validation on all inputs |
| **Neon connection issues** | Connection pooling built-in; timeout-safe with stale cache fallback |

---

## 📖 Implementation Order

**Week 1**:
1. Phase 1: Database setup
2. Phase 2: Cache manager (includes TTL checking logic)
3. Phase 3: GitHub batch fetchers

**Week 2**:
4. Phase 4: Remote function
5. Phase 5: Update projects query
6. Phase 6: Database-driven TTL refresh (stale-while-revalidate built-in)

**Week 3+** (Optional):
7. Phase 7: Error handling refinement
8. Phase 8: Client integration polish
9. Phase 9: UI enhancements (cache age badges, manual refresh)

---

## 🔗 Related Documentation

- **Shipyard Engineering Spec**: `shipyard/engineering.md`
- **Design System**: `shipyard/design-system.md`
- **Registry Config**: `src/lib/server/registry-config.ts`
- **SvelteKit Remote Functions**: https://kit.svelte.dev/docs/remote-functions
- **Neon Docs**: https://neon.tech/docs

---

## ✨ Summary

This plan leverages:

1. **SvelteKit's `query.batch`** → Automatic request batching (solves n+1)
2. **Neon DB caching** → Instant responses on cache hit (~50ms)
3. **Database-driven TTL** → Lazy refresh based on `fetchedAt` timestamp (no cron needed)
4. **Stale-while-revalidate** → Users never wait, always get instant response with async refresh

**The Magic**: On each request, we check the database's `fetchedAt` timestamp. If data is older than TTL (e.g., 6 hours), we return the cached data immediately and spawn an async refresh in the background. No scheduled jobs, no external services — just simple timestamp math.

**Result**: Transforms Shipyard's GitHub data layer from a slow, fragile monolith into a **resilient, high-performance system** that:
- ✅ Loads instantly from cache (98% faster)
- ✅ Gracefully handles GitHub downtime (falls back to stale cache)
- ✅ Reduces API calls by 98% (one fetch per 6 hours vs every visit)
- ✅ Works in any environment (Vercel, Netlify, self-hosted — no special infra needed)
- ✅ Keeps data fresh with transparent background updates

The beauty: **developers write normal code**, SvelteKit handles batching, database handles TTL checking. No complex orchestration! 🎉

---

**Questions Before Implementation?**
- Cache TTL: 6 hours preferred, or different?
- Should we batch non-clustered repos separately, or mix them together?
- Want cache age UI badges showing "Updated 2h ago"?


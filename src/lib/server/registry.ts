import { fetchRepositories } from './github';
import { registryConfig } from './registry-config';
import type { DisplayProject, RepoData } from '$lib/types';
import {
	getCachedRepositories,
	shouldRefreshCluster,
	setCachedRepositories,
	startCacheRefresh,
	recordCacheError,
	getStaleDataFallback
} from './cache-manager';

const REGISTRY_CACHE_KEY = '__system_registry__';

/**
 * Determines the project type based on repository metadata
 */
function detectProjectType(repo: RepoData): DisplayProject['projectType'] {
	const topics = repo.repositoryTopics.nodes
		.map((n) => n.topic.name)
		.join(' ')
		.toLowerCase();
	const languages = repo.languages.edges.map((e) => e.node.name).map((n) => n.toLowerCase());
	const description = (repo.description || '').toLowerCase();

	// Check for MCP servers
	if (topics.includes('mcp') || topics.includes('mcp-server')) return 'mcp-server';

	// Check for plugin/extension
	if (
		topics.includes('plugin') ||
		topics.includes('extension') ||
		repo.name.includes('plugin') ||
		repo.name.includes('extension')
	) {
		return 'plugin';
	}

	// Check for library/package
	if (
		topics.includes('library') ||
		topics.includes('npm') ||
		topics.includes('package') ||
		description.includes('library') ||
		description.includes('npm package')
	) {
		return 'library';
	}

	// Check for API/Service
	if (
		topics.includes('api') ||
		topics.includes('rest-api') ||
		topics.includes('backend') ||
		languages.includes('go') ||
		(languages.includes('rust') && description.includes('api')) ||
		description.includes('api') ||
		description.includes('service')
	) {
		return 'api';
	}

	// Check for documentation
	if (
		topics.includes('docs') ||
		topics.includes('documentation') ||
		repo.name.includes('-docs') ||
		description.includes('documentation')
	) {
		return 'docs';
	}

	// Check for tool
	if (topics.includes('tool') || topics.includes('cli') || languages.includes('rust')) {
		return 'tool';
	}

	// Check for framework
	if (
		topics.includes('framework') ||
		topics.includes('ssg') ||
		description.includes('static site generator')
	) {
		return 'framework';
	}

	// Check for full applications
	if (
		description.includes('application') ||
		description.includes('app') ||
		topics.includes('desktop') ||
		topics.includes('tauri')
	) {
		return 'app';
	}

	// Default to app if Svelte/SvelteKit project
	if (languages.includes('svelte') || topics.includes('sveltekit')) {
		return 'app';
	}

	return 'tool';
}

export async function getRegistry(): Promise<DisplayProject[]> {
	console.log(`[Registry] getRegistry called. Checking cache...`);
	// 1. Load Registry Config
	const config = registryConfig;

	// 2. Fetch GitHub Data with Caching
	let repos: RepoData[] | null = null;
	const needsRefresh = await shouldRefreshCluster(REGISTRY_CACHE_KEY);

	if (!needsRefresh) {
		console.log(`[Registry] Cache hit for ${REGISTRY_CACHE_KEY}`);
		const cached = await getCachedRepositories(REGISTRY_CACHE_KEY);
		repos = cached as RepoData[] | null;
	}

	if (!repos || needsRefresh) {
		console.log(
			`[Registry] Cache miss or stale for ${REGISTRY_CACHE_KEY}. Fetching from GitHub...`
		);
		try {
			await startCacheRefresh(REGISTRY_CACHE_KEY);
			repos = await fetchRepositories();
			console.log(`[Registry] GitHub returned ${repos.length} raw repos`);
			await setCachedRepositories(REGISTRY_CACHE_KEY, repos as any);
			console.log(`[Registry] Successfully cached ${repos.length} repos`);
		} catch (error) {
			console.error(`[Registry] Failed to fetch repositories:`, error);
			const staleData = await getStaleDataFallback(REGISTRY_CACHE_KEY);
			if (staleData) {
				console.log(`[Registry] Falling back to stale data`);
				repos = staleData as RepoData[];
			} else {
				repos = [];
			}
			await recordCacheError(
				REGISTRY_CACHE_KEY,
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	// Ensure repos is not null even if everything failed
	const finalRepos: RepoData[] = repos || [];

	const repoMap = new Map<string, RepoData>(finalRepos.map((r) => [r.name, r]));

	const displayProjects: DisplayProject[] = [];
	const processedRepos = new Set<string>();

	// 3. Process Groups (Clusters)
	for (const group of config.groups || []) {
		const groupRepos = group.repos
			.map((name) => {
				processedRepos.add(name);
				return repoMap.get(name);
			})
			.filter((r) => r !== undefined) as RepoData[];

		if (groupRepos.length === 0) continue;

		const totalStars = groupRepos.reduce((acc, r) => acc + r.stargazers.totalCount, 0);
		// Find latest update
		const latestUpdate = groupRepos.reduce((latest, r) => {
			return new Date(r.updatedAt) > new Date(latest) ? r.updatedAt : latest;
		}, groupRepos[0].updatedAt);

		// Merge topics and languages from all repos in group, deduplicated
		const topics = Array.from(
			new Set(groupRepos.flatMap((r) => r.repositoryTopics.nodes.map((n) => n.topic.name)))
		);

		// Simplified languages aggregation: just take top 3 distinct from all
		const allLangs = groupRepos.flatMap((r) => r.languages.edges.map((e) => e.node));
		const uniqueLangs = Array.from(new Map(allLangs.map((l) => [l.name, l])).values()).slice(0, 3);

		displayProjects.push({
			id: group.id,
			name: group.name,
			description: `Collection of ${groupRepos.length} repositories including ${group.repos.join(', ')}`,
			stars: totalStars,
			updatedAt: latestUpdate,
			url: groupRepos[0].url,
			topics: topics.slice(0, 5),
			languages: uniqueLangs,
			isCluster: true,
			featured: group.featured,
			experimental:
				group.experimental ||
				topics.includes('experimental') ||
				topics.includes('alpha') ||
				topics.includes('beta'),
			projectType: groupRepos.some((r) => detectProjectType(r) === 'app') ? 'app' : 'tool',
			repoCount: groupRepos.length,
			subProjects: groupRepos
				.map((r) => ({
					name: r.name,
					description: r.description,
					url: r.url,
					updatedAt: r.updatedAt,
					stars: r.stargazers.totalCount
				}))
				.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		});
	}

	// 4. Process Individual Repos
	for (const repo of finalRepos) {
		// Skip forks - only show original projects
		if (repo.isFork) continue;

		if (processedRepos.has(repo.name)) continue;

		const override = config.overrides?.[repo.name];

		displayProjects.push({
			id: repo.name,
			name: override?.name || repo.name,
			description: repo.description || '',
			stars: repo.stargazers.totalCount,
			updatedAt: repo.updatedAt,
			url: repo.url,
			topics: repo.repositoryTopics.nodes.map((n) => n.topic.name),
			languages: repo.languages.edges.map((e) => e.node),
			isCluster: false,
			featured: override?.featured || false,
			experimental:
				override?.experimental ||
				repo.repositoryTopics.nodes.some(
					(n) =>
						n.topic.name === 'experimental' || n.topic.name === 'alpha' || n.topic.name === 'beta'
				),
			projectType: detectProjectType(repo)
		});
	}

	// 5. Filter & Sort
	const CUTOFF_DATE = new Date('2025-01-01T00:00:00Z');

	const sortedProjects = displayProjects
		.filter((p) => new Date(p.updatedAt) >= CUTOFF_DATE)
		.sort((a, b) => {
			if (a.featured && !b.featured) return -1;
			if (!a.featured && b.featured) return 1;
			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
		});

	return sortedProjects;
}

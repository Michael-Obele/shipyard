import { fetchRepositories } from './github';
import { registryConfig } from './registry-config';
import type { DisplayProject, RepoData } from '$lib/types';

export async function getRegistry(): Promise<DisplayProject[]> {
	// 1. Load Registry Config
	const config = registryConfig;

	// 2. Fetch GitHub Data
	const repos = await fetchRepositories();
	const repoMap = new Map<string, RepoData>(repos.map((r) => [r.name, r]));

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
        const topics = Array.from(new Set(groupRepos.flatMap(r => r.repositoryTopics.nodes.map(n => n.topic.name))));
        
        // Simplified languages aggregation: just take top 3 distinct from all
        const allLangs = groupRepos.flatMap(r => r.languages.edges.map(e => e.node));
        const uniqueLangs = Array.from(new Map(allLangs.map(l => [l.name, l])).values()).slice(0, 3);

		displayProjects.push({
			id: group.id,
			name: group.name,
			description: `Collection of ${groupRepos.length} repositories including ${group.repos.join(', ')}`,
			stars: totalStars,
			updatedAt: latestUpdate,
			url: groupRepos[0].url, // Link to first repo or maybe a generic one needed
			topics: topics.slice(0, 5),
			languages: uniqueLangs,
			isCluster: true,
			featured: group.featured,
			repoCount: groupRepos.length
		});
	}

	// 4. Process Individual Repos
	for (const repo of repos) {
		if (processedRepos.has(repo.name)) continue;

		const override = config.overrides?.[repo.name];
		// Skip if not explicitly featured? The engineering md says "Fetches live stats... for everything". 
        // But design-system mentions "Curation via size".
        // Let's include everything but respect overrides.

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
			featured: override?.featured || false
		});
	}

    // Sort: Featured first, then by date or stars? 
    // "High-impact projects occupy larger Bento cells".
    // Let's sort by Featured then UpdatedAt
    displayProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

	return displayProjects;
}

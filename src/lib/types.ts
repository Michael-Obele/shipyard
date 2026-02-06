export interface RepoData {
	id: string;
	name: string;
	description: string | null;
	url: string;
	isFork: boolean;
	stargazers: {
		totalCount: number;
	};
	updatedAt: string;
	languages: {
		edges: {
			size: number;
			node: {
				name: string;
				color: string;
			};
		}[];
	};
	repositoryTopics: {
		nodes: {
			topic: {
				name: string;
			};
		}[];
	};
}

export interface DisplayProject {
	id: string;
	name: string;
	description: string;
	stars: number;
	updatedAt: string;
	url: string;
	topics: string[];
	languages: { name: string; color: string }[];
	isCluster: boolean;
	featured: boolean;
	experimental: boolean;
	projectType?: 'app' | 'api' | 'library' | 'mcp-server' | 'plugin' | 'tool' | 'docs' | 'framework';
	repoCount?: number;
	subProjects?: {
		name: string;
		description: string | null;
		url: string;
		updatedAt: string;
		stars: number;
	}[];
}

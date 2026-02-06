export interface RegistryConfig {
	groups: {
		id: string;
		name: string;
		repos: string[];
		featured: boolean;
	}[];
	overrides: Record<string, { name?: string; featured?: boolean }>;
}

export const registryConfig: RegistryConfig = {
	groups: [
		{
			id: 'cinder',
			name: 'Cinder Ecosystem',
			repos: ['cinder', 'cinder-sv', 'cinder-mcp'],
			featured: true
		}
	],
	overrides: {
		tif: {
			name: 'Tech Invoice Forge',
			featured: true
		}
	}
};

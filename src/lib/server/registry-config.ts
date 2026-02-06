export interface RegistryConfig {
	groups: {
		id: string;
		name: string;
		repos: string[];
		featured: boolean;
		experimental?: boolean;
	}[];
	overrides: Record<string, { name?: string; featured?: boolean; experimental?: boolean }>;
}

export const registryConfig: RegistryConfig = {
	groups: [
		{
			id: 'cinder',
			name: 'Cinder Ecosystem',
			repos: ['cinder', 'cinder-sv', 'cinder-mcp'],
			featured: true
		},
		{
			id: 'vaultnote',
			name: 'VaultNote Ecosystem',
			repos: ['VaultNote', 'VaultNoteServer'],
			featured: true
		},
		{
			id: 'experimental-labs',
			name: 'Experimental Labs',
			repos: [],
			featured: false,
			experimental: true
		}
	],
	overrides: {
		tif: {
			name: 'Tech Invoice Forge',
			featured: true
		},
		'secret-project': {
			experimental: true
		}
	}
};

import { getRegistry } from '$lib/server/registry';

export async function load() {
	let projects = await getRegistry();

	// STRICT FILTER: Only show projects updated in 2025 or later
	projects = projects.filter(p => new Date(p.updatedAt) >= new Date('2025-01-01'));

	return {
		projects
	};
}

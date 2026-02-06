import { query } from '$app/server';
import { getRegistry } from '$lib/server/registry';

/**
 * Fetches all projects from the registry, filtered by the 2025+ cutoff date.
 * This replaces the server-side load function with a query remote function for better performance.
 */
export const getProjects = query(async () => {
	let projects = await getRegistry();

	// STRICT FILTER: Only show projects updated in 2025 or later
	projects = projects.filter((p) => new Date(p.updatedAt) >= new Date('2025-01-01'));

	return projects;
});

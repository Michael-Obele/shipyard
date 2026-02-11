import { query } from '$app/server';
import { getRegistry } from '$lib/server/registry';

/**
 * Fetches all projects from the registry, filtered by the 2025+ cutoff date.
 * This replaces the server-side load function with a query remote function for better performance.
 */
export const getProjects = query(async () => {
	console.log('[Remote:getProjects] Fetching registry data...');
	try {
		const projects = await getRegistry();
		console.log(`[Remote:getProjects] Received ${projects.length} total projects from registry`);

		// STRICT FILTER: Only show projects updated in 2025 or later
		const filtered = projects.filter((p) => new Date(p.updatedAt) >= new Date('2025-01-01'));
		console.log(
			`[Remote:getProjects] Returning ${filtered.length} projects after 2025-01-01 filter`
		);

		return filtered;
	} catch (error) {
		console.error('[Remote:getProjects] Error in remote function:', error);
		throw error;
	}
});

import { getProjects } from '$lib/remote/projects.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	console.log('[PageServerLoad] Fetching initial projects...');
	const projects = await getProjects();
	return {
		projects
	};
};

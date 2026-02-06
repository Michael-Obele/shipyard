import { getRegistry } from '$lib/server/registry';

export async function load() {
	const projects = await getRegistry();
	return {
		projects
	};
}

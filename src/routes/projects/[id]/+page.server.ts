import { getRegistry } from '$lib/server/registry';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const registry = await getRegistry();
    // Case insensitive exact match or close match? Use exact for ID.
    const project = registry.find((p) => p.id.toLowerCase() === params.id.toLowerCase());

    if (!project) {
        throw error(404, 'Module not found');
    }

    return {
        project
    };
}

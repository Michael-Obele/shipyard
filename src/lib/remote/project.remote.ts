import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { getRegistry } from '$lib/server/registry';

/**
 * Schema for validating the project ID parameter
 */
const ProjectIdSchema = v.pipe(v.string(), v.nonEmpty());

/**
 * Fetches a single project by ID from the registry.
 * This replaces the server-side load function with a query remote function for better performance.
 * @param id - The project ID (case-insensitive)
 * @returns The project data or throws a 404 error if not found
 */
export const getProject = query(ProjectIdSchema, async (id: string) => {
	const registry = await getRegistry();

	// Case insensitive exact match
	const project = registry.find((p) => p.id.toLowerCase() === id.toLowerCase());

	if (!project) {
		error(404, 'Module not found');
	}

	return project;
});

import { getProject } from '$lib/remote/project.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const project = await getProject(params.id);
    return {
        project
    };
};

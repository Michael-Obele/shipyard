<script lang="ts">
	import type { DisplayProject } from '$lib/types';
	import ClusterProjectCard from './ClusterProjectCard.svelte';
	import SingleProjectCard from './SingleProjectCard.svelte';

	let { project }: { project: DisplayProject } = $props();
</script>

{#if project.isCluster}
	<ClusterProjectCard {project} />
{:else}
	<SingleProjectCard {project} />
{/if}

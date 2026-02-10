<script lang="ts">
	import { untrack } from 'svelte';
	import RepositoriesSection from './RepositoriesSection.svelte';
	import { getRepositoriesByClusterRemote } from '$lib/remote/repositories.remote';

	interface Props {
		clusterName: string;
		title: string;
		description: string;
	}

	const { clusterName, title, description } = $props();

	// Trigger async data fetching
	// Use untrack to avoid re-running when clusterName changes
	const reposPromise = untrack(() => getRepositoriesByClusterRemote(clusterName));
</script>

{#await reposPromise}
	<!-- Loading state -->
	<RepositoriesSection {clusterName} {title} {description} isLoading={true} />
{:then result}
	<!-- Success state -->
	{#if result.error}
		<RepositoriesSection {clusterName} {title} {description} repos={[]} error={result.error} />
	{:else}
		<RepositoriesSection {clusterName} {title} {description} repos={result.repos} />
	{/if}
{:catch error}
	<!-- Error state -->
	<RepositoriesSection
		{clusterName}
		{title}
		{description}
		repos={[]}
		error={error instanceof Error ? error.message : 'Unknown error occurred'}
	/>
{/await}

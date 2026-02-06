<script lang="ts">
	import ProjectCard from '$lib/components/page/ProjectCard.svelte';
	let { data } = $props();
</script>

<div class="min-h-screen bg-background p-8 font-sans">
	<header class="mb-12 space-y-4">
		<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">Shipyard</h1>
		<p class="text-xl text-muted-foreground">Mechanical Artisan Engineering Registry.</p>
		<div class="h-1 w-20 bg-primary/50"></div>
	</header>

	<div class="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each data.projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</div>

<script lang="ts">
	import ProjectCard from '$lib/components/page/ProjectCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Terminal, Activity, Anchor } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="min-h-screen bg-background p-6 font-sans selection:bg-primary/20 md:p-12">
	<header class="mb-12 space-y-8">
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<div class="space-y-3">
				<div class="flex items-center gap-3">
					<div class="rounded-md border border-primary/20 bg-primary/10 p-2.5">
						<Anchor class="size-6 text-primary" />
					</div>
					<h1 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-5xl">
						SHIPYARD
					</h1>
				</div>
				<p class="max-w-2xl text-lg font-light text-muted-foreground">
					Engineering Manifest <span class="mx-2 font-mono text-sm text-primary/50">//</span> 2025-2026
				</p>
			</div>

			<div
				class="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 font-mono text-xs text-muted-foreground backdrop-blur-sm md:gap-4 md:text-sm"
			>
				<div class="flex items-center gap-2 border-r border-border/50 px-2 pr-4">
					<Activity class="size-4 animate-pulse text-green-500" />
					<span>SYSTEM NORMAL</span>
				</div>
				<div class="px-2">
					<span class="font-bold text-foreground">{data.projects.length}</span> MODULES ACTIVE
				</div>
			</div>
		</div>

		<div
			class="flex items-center gap-4 pl-1 font-mono text-xs tracking-widest text-muted-foreground/60 uppercase"
		>
			<span>Registry v2.0</span>
			<span class="text-primary/20">•</span>
			<span>Secure Connection</span>
			<span class="text-primary/20">•</span>
			<span>Verified Builds Only</span>
		</div>

		<Separator class="bg-gradient-to-r from-primary/30 to-transparent" />
	</header>

	<!-- Masonry-ish Grid / Data-Dense Layout -->
	<div
		class="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
	>
		{#each data.projects as project (project.id)}
			<ProjectCard {project} />
		{/each}

		<!-- Empty State if strict filter removes everything -->
		{#if data.projects.length === 0}
			<div
				class="col-span-full space-y-4 rounded-xl border-2 border-dashed border-border/50 py-20 text-center"
			>
				<Terminal class="mx-auto size-10 text-muted-foreground" />
				<h3 class="text-xl font-bold text-muted-foreground">No Active Modules Detected</h3>
				<p class="text-muted-foreground/70">System filters are hiding older projects.</p>
			</div>
		{/if}
	</div>
</div>

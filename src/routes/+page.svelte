<script lang="ts">
	import ProjectCard from '$lib/components/page/ProjectCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Terminal,
		Activity,
		Anchor,
		Sparkles,
		Layers,
		Beaker,
		Cpu,
		ArrowRight,
		Shield,
		BookOpen,
		Network,
		Boxes
	} from '@lucide/svelte';
	import { getProjects } from '$lib/remote/projects.remote';

	let { data } = $props();

	// Initialize with SSR data to prevent flicker, but allow refresh
	let projects = $state<any[]>(data.projects || []);
	let isLoading = $state(false);

	$effect(() => {
		// Keep projects in sync with server data if it changes (e.g. navigation)
		if (data.projects) {
			projects = data.projects;
		}

		console.log('[Homepage] Data session stats:', projects.length, 'modules active');

		// If projects are still empty (shouldn't happen with SSR but safe check)
		if (projects.length === 0) {
			console.log('[Homepage] No projects found, performing late refresh...');
			getProjects().then((p) => {
				projects = p;
			});
		}
	});

	const hero = $derived(projects.length > 0 ? projects[0] : null);

	const featuredStacks = $derived(
		projects.slice(1).filter((p) => p.featured && !p.isCluster && !p.experimental)
	);

	const groups = $derived(projects.slice(1).filter((p) => p.isCluster && !p.experimental));

	const experimental = $derived(projects.slice(1).filter((p) => p.experimental));

	const generalRegistry = $derived(
		projects.slice(1).filter((p) => !p.featured && !p.isCluster && !p.experimental)
	);
</script>

<svelte:head>
	<title>Shipyard - Project Registry</title>
	<meta
		name="description"
		content="Discover curated open-source projects and developer tools. A Mechanical Artisan registry showcasing innovative software solutions, frameworks, and applications."
	/>
	<meta
		name="keywords"
		content="open source, projects, developer tools, software registry, frameworks, applications"
	/>
	<link rel="canonical" href="https://shipyard.registry/" />
	<meta property="og:title" content="Shipyard - Project Registry" />
	<meta
		property="og:description"
		content="Discover curated open-source projects and developer tools. A Mechanical Artisan registry showcasing innovative software solutions."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shipyard.registry/" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Shipyard - Project Registry" />
	<meta
		name="twitter:description"
		content="Discover curated open-source projects and developer tools."
	/>
</svelte:head>

{#snippet sectionHeader(title: string, tagline: string, icon: any, id: string)}
	{@const Icon = icon}
	<div {id} class="mb-8 space-y-4 pt-12">
		<div class="flex items-center gap-3">
			<div class="rounded-lg border border-slate-800 bg-secondary/50 p-2 text-primary shadow-inner">
				<Icon class="size-5" />
			</div>
			<div class="space-y-1">
				<h2 class="text-xl font-bold tracking-tight text-foreground uppercase md:text-2xl">
					{title}
				</h2>
				<p class="font-mono text-xs tracking-wider text-muted-foreground uppercase opacity-70">
					{tagline}
				</p>
			</div>
		</div>
		<Separator class="bg-linear-to-r from-primary/20 via-border to-transparent" />
	</div>
{/snippet}

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
					<span class="font-bold text-foreground">{projects.length}</span> MODULES ACTIVE
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

		<Separator class="bg-linear-to-r from-primary/30 to-transparent" />
	</header>

	<div id="projects" class="space-y-24">
		<!-- Hero Section -->
		{#if hero}
			<div
				class="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-8 shadow-2xl backdrop-blur-md transition-all hover:border-primary/40 md:p-12"
			>
				<div
					class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background"
				></div>
				<div class="grid gap-8 lg:grid-cols-2">
					<div class="space-y-6">
						<div class="space-y-2">
							<Badge class="bg-primary text-primary-foreground hover:bg-primary/90"
								>LATEST DEPLOYMENT</Badge
							>
							<h2
								class="text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl"
							>
								{hero.name}
							</h2>
						</div>
						<p class="max-w-xl text-lg text-muted-foreground selection:bg-primary/10">
							{hero.description}
						</p>
						<div class="flex flex-wrap gap-2">
							{#each hero.topics as topic}
								<Badge variant="secondary" class="font-mono text-xs">{topic}</Badge>
							{/each}
						</div>
						<a
							href="/projects/{hero.id}"
							class="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
						>
							View Mission Details <ArrowRight class="size-4" />
						</a>
					</div>
				</div>
			</div>
		{/if}

		<div class="space-y-24">
			<!-- Featured Stacks -->
			{#if featuredStacks.length > 0}
				<section>
					{@render sectionHeader(
						'Featured Stacks',
						'High-impact engineering modules',
						Sparkles,
						'featured'
					)}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each featuredStacks as project (project.id)}
							<ProjectCard {project} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- Groups -->
			{#if groups.length > 0}
				<section>
					{@render sectionHeader('Groups', 'Multi-repo ecosystems & toolchains', Boxes, 'groups')}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each groups as project (project.id)}
							<ProjectCard {project} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- Experimental -->
			{#if experimental.length > 0}
				<section>
					{@render sectionHeader(
						'Experimental',
						'Research, prototypes & early-stage builds',
						Beaker,
						'experimental'
					)}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each experimental as project (project.id)}
							<ProjectCard {project} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- General Registry -->
			{#if generalRegistry.length > 0}
				<section>
					{@render sectionHeader(
						'Project Registry',
						'General purpose tools & utilities',
						Cpu,
						'registry'
					)}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each generalRegistry as project (project.id)}
							<ProjectCard {project} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- Platform Sections (Placeholders based on Footer) -->
			<div class="grid grid-cols-1 gap-8 pt-12 lg:grid-cols-3">
				<section
					id="about"
					class="group space-y-4 rounded-xl border border-slate-800 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30"
				>
					<div class="flex items-center gap-3 text-primary">
						<Network class="size-5" />
						<h3 class="font-bold tracking-tight uppercase">Architecture</h3>
					</div>
					<p class="text-sm leading-relaxed text-muted-foreground">
						High-performance SvelteKit 5 architecture using ISR caching and a hybrid data layer for
						real-time repository analysis.
					</p>
				</section>

				<section
					id="docs"
					class="group space-y-4 rounded-xl border border-slate-800 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30"
				>
					<div class="flex items-center gap-3 text-primary">
						<BookOpen class="size-5" />
						<h3 class="font-bold tracking-tight uppercase">Blueprint</h3>
					</div>
					<p class="text-sm leading-relaxed text-muted-foreground">
						The Mechanical Artisan design system. Detailed technical specifications and
						implementation patterns for the Shipyard registry.
					</p>
				</section>

				<section
					id="legal"
					class="group space-y-4 rounded-xl border border-slate-800 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30"
				>
					<div class="flex items-center gap-3 text-primary">
						<Shield class="size-5" />
						<h3 class="font-bold tracking-tight uppercase">System Status</h3>
					</div>
					<div
						class="flex w-fit items-center gap-2 rounded bg-emerald-500/10 px-2 py-1 font-mono text-xs text-emerald-500"
					>
						<Activity class="size-3 animate-pulse" />
						CORE MODULES ONLINE
					</div>
					<p class="text-sm leading-relaxed text-muted-foreground">
						Continuous verification of GitHub API connectivity and build integrity across all
						registered project clusters.
					</p>
				</section>
			</div>

			<!-- Empty State if strict filter removes everything -->
			{#if projects.length === 0}
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
</div>

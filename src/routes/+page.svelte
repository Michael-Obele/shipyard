<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Anchor,
		Ship,
		Compass,
		Container,
		LayoutGrid,
		Filter,
		Search,
		ArrowRight,
		Shield,
		Activity,
		Terminal,
		List,
		Hexagon,
		ArrowUpDown,
		ArrowUp,
		ArrowDown,
		Calendar,
		ArrowDownAZ,
		Star,
		Rocket,
		ChevronRight,
		Tags
	} from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Lordicon } from '$lib/components/ui/lordicon';
	import ProjectCard from '$lib/components/page/ProjectCard.svelte';
	import { getProjects } from '$lib/remote/projects.remote';
	import type { DisplayProject } from '$lib/types';

	let { data } = $props();

	// --- State Management ---
	// Initialize with SSR data, but keep it bindable/refreshable
	let allProjects = $derived<DisplayProject[]>(data.projects || []);
	let searchQuery = $state('');
	let viewMode = $state<'grid' | 'list'>('grid');
	let sortMode = $state<'name' | 'stars' | 'updated' | 'type'>('name');
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let isScrolled = $state(false);

	// --- Side Effects ---
	$effect(() => {
		// Sync with server data if it changes
		if (data.projects) {
			allProjects = data.projects;
		}

		// Client-side fail-safe fetch
		if (allProjects.length === 0) {
			getProjects().then((p) => {
				allProjects = p;
			});
		}

		// Scroll listener for sticky header styling
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// --- Derived State (The shipyard logic) ---

	const filteredList = $derived(
		allProjects
			.filter((p) => {
				if (!searchQuery) return true;
				const q = searchQuery.toLowerCase();
				return (
					p.name.toLowerCase().includes(q) ||
					p.description?.toLowerCase().includes(q) ||
					p.topics?.some((t) => t.toLowerCase().includes(q))
				);
			})
			.sort((a, b) => {
				const dir = sortDirection === 'asc' ? 1 : -1;

				if (sortMode === 'stars') {
					return (a.stars - b.stars) * dir;
				}

				if (sortMode === 'updated') {
					return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir;
				}

				if (sortMode === 'type') {
					const typeA = a.projectType || 'zz'; // Push undefined to end
					const typeB = b.projectType || 'zz';
					return typeA.localeCompare(typeB) * dir;
				}

				// Default 'name': alphabetical sort
				return a.name.localeCompare(b.name) * dir;
			})
	);

	// The "Flagship" is the most prominent project (explicitly marked or fallback to first)
	const flagship = $derived(
		filteredList.find((p) => p.isFlagship) || (filteredList.length > 0 ? filteredList[0] : null)
	);

	// Helper to filter out the flagship from other lists to avoid duplication
	const remainingProjects = $derived(filteredList.filter((p) => p.id !== flagship?.id));

	// "Fleets" are project clusters (groups of repositories)
	const fleets = $derived(remainingProjects.filter((p) => p.isCluster && !p.experimental));

	// "Dry Dock" contains experimental or R&D projects
	const dryDock = $derived(remainingProjects.filter((p) => p.experimental));

	// "Cargo" / "Manifest" contains standard standalone projects
	const cargo = $derived(remainingProjects.filter((p) => !p.isCluster && !p.experimental));
</script>

<svelte:head>
	<title>Shipyard - Engineering Registry</title>
	<meta
		name="description"
		content="A curated mechanical artisan registry for high-performance engineering projects."
	/>
</svelte:head>

<div class="min-h-screen bg-background pb-32">
	<!-- CONTROL DECK (Sticky Header) -->
	<header
		class="sticky top-0 z-50 border-b transition-all duration-300 ease-out {isScrolled
			? 'border-border bg-background/95 backdrop-blur-md'
			: 'border-transparent bg-transparent'}"
	>
		<div class="container mx-auto px-4 py-4">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<!-- Brand / Breadcrumb -->
				<div class="flex items-center gap-3">
					<div
						class="flex size-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm"
					>
						<Anchor class="size-6 text-primary" />
					</div>
					<div>
						<h1 class="text-lg font-bold tracking-tight text-foreground">SHIPYARD</h1>
						<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<span class="tracking-widest uppercase">REGISTRY</span>
							<span class="h-1 w-1 rounded-full bg-muted"></span>
							<span class="font-mono text-primary">v2.0.0</span>
						</div>
					</div>
				</div>

				<!-- Search & Controls -->
				<div class="flex w-full flex-wrap items-center gap-3 md:w-auto md:flex-nowrap">
					<div class="relative w-full md:w-64">
						<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search manifest..."
							bind:value={searchQuery}
							class="h-10 w-full rounded-md border border-border bg-secondary/30 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
						/>
					</div>

					<!-- Sort Controls -->
					<div class="flex items-center gap-1 rounded-md border border-border bg-secondary/30 p-1">
						<button
							class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-accent/50"
							class:bg-accent={sortMode === 'name'}
							class:text-primary={sortMode === 'name'}
							class:text-muted-foreground={sortMode !== 'name'}
							onclick={() => (sortMode = 'name')}
							aria-label="Sort by Name"
							title="Sort by Name"
						>
							<ArrowDownAZ class="size-3" />
							<span class="hidden lg:inline">Name</span>
						</button>
						<button
							class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-accent/50"
							class:bg-accent={sortMode === 'stars'}
							class:text-primary={sortMode === 'stars'}
							class:text-muted-foreground={sortMode !== 'stars'}
							onclick={() => (sortMode = 'stars')}
							aria-label="Sort by Stars"
							title="Sort by Stars"
						>
							<Activity class="size-3" />
							<span class="hidden lg:inline">Stars</span>
						</button>
						<button
							class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-accent/50"
							class:bg-accent={sortMode === 'updated'}
							class:text-primary={sortMode === 'updated'}
							class:text-muted-foreground={sortMode !== 'updated'}
							onclick={() => (sortMode = 'updated')}
							aria-label="Sort by Date"
							title="Sort by Date"
						>
							<Calendar class="size-3" />
							<span class="hidden lg:inline">Date</span>
						</button>
						<button
							class="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-accent/50"
							class:bg-accent={sortMode === 'type'}
							class:text-primary={sortMode === 'type'}
							class:text-muted-foreground={sortMode !== 'type'}
							onclick={() => (sortMode = 'type')}
							aria-label="Sort by Type"
							title="Sort by Type"
						>
							<Tags class="size-3" />
							<span class="hidden lg:inline">Type</span>
						</button>

						<Separator orientation="vertical" class="mx-1 h-4" />

						<button
							class="flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-accent/50"
							onclick={() => (sortDirection = sortDirection === 'asc' ? 'desc' : 'asc')}
							aria-label={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
							title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
						>
							{#if sortDirection === 'asc'}
								<ArrowUp class="size-3 text-muted-foreground" />
							{:else}
								<ArrowDown class="size-3 text-muted-foreground" />
							{/if}
						</button>
					</div>

					<div class="flex rounded-md border border-border bg-secondary/30 p-1">
						<button
							class="rounded px-2 py-1 transition-colors hover:bg-accent/50"
							class:bg-accent={viewMode === 'grid'}
							class:text-primary={viewMode === 'grid'}
							class:text-muted-foreground={viewMode !== 'grid'}
							onclick={() => (viewMode = 'grid')}
							aria-label="Grid view"
						>
							<LayoutGrid class="size-4" />
						</button>
						<button
							class="rounded px-2 py-1 transition-colors hover:bg-accent/50"
							class:bg-accent={viewMode === 'list'}
							class:text-primary={viewMode === 'list'}
							class:text-muted-foreground={viewMode !== 'list'}
							onclick={() => (viewMode = 'list')}
							aria-label="List view"
						>
							<List class="size-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>

	<main class="container mx-auto mt-8 space-y-16 px-4">
		<!-- SECTION: FLAGSHIP -->
		{#if flagship}
			<section in:fade={{ duration: 400 }}>
				<div class="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
					<h2 class="text-xl font-black tracking-tighter text-foreground uppercase">
						Flagship Vessel
					</h2>
					<span class="font-mono text-[10px] text-muted-foreground">
						REF:<span class="ml-1 font-bold text-primary"
							>{flagship.id.split('-')[0].toUpperCase()}</span
						>
					</span>
				</div>
				<div
					class="group relative overflow-hidden rounded-xl border border-border bg-card p-1 shadow-2xl transition-all hover:border-border/80"
				>
					<!-- Flagship styling is custom, distinct from standard cards -->
					<div
						class="relative z-10 grid gap-8 overflow-hidden rounded-lg bg-muted/40 p-6 md:grid-cols-2 lg:p-12 dark:bg-secondary/50"
					>
						<div class="flex flex-col justify-center space-y-6">
							<div class="space-y-4">
								<Badge variant="outline" class="w-fit border-primary/50 text-primary">
									FEATURED VESSEL
								</Badge>
								<h2
									class="text-4xl font-extrabold tracking-tighter text-foreground md:text-5xl lg:text-6xl"
								>
									{flagship.name}
								</h2>
								<p class="max-w-xl text-lg text-muted-foreground">
									{flagship.description}
								</p>
							</div>

							<div class="flex flex-wrap gap-2">
								{#each flagship.topics as topic (topic)}
									<Badge class="bg-muted/80 text-muted-foreground hover:bg-muted">{topic}</Badge>
								{/each}
							</div>

							<div class="pt-4">
								<Button size="lg" class="group/btn gap-2" href="/projects/{flagship.id}">
									Initialize
									<ArrowRight class="size-4 transition-transform group-hover/btn:translate-x-1" />
								</Button>
							</div>
						</div>

						<div
							class="relative flex items-center justify-center rounded-xl border border-border/30 bg-background/50 p-8 dark:border-transparent dark:shadow-inner"
						>
							<!-- Lordicon Flagship Visual -->
							<div
								class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
							></div>

							<Lordicon
								src="https://cdn.lordicon.com/prjriwwv.json"
								primaryColor="#d46211"
								secondaryColor="#475569"
								loopAfterIn={true}
								delay={500}
								size={450}
								height={550}
							/>
						</div>
					</div>

					<!-- Mechanical Background Elements -->
					<div
						class="absolute -top-20 -right-20 z-0 h-96 w-96 rounded-full border border-primary/10 bg-primary/5 blur-3xl dark:border-border/50 dark:bg-secondary/20"
					></div>
				</div>
			</section>
		{/if}

		<!-- SECTION: THE FLEET (Clusters) -->
		{#if fleets.length > 0}
			<section>
				<div class="mb-8 flex items-center gap-3 border-b border-border pb-4">
					<Lordicon
						src="https://cdn.lordicon.com/ggphewkj.json"
						primaryColor="#d46211"
						secondaryColor="#475569"
						loopAfterIn={true}
						delay={300}
						size={50}
						height={50}
						target="div"
						trigger="hover"
					/>
					<h3 class="text-xl font-bold tracking-tight text-foreground uppercase">Active Fleets</h3>
					<span class="ml-auto font-mono text-sm text-muted-foreground"
						>{fleets.length} FORMATIONS</span
					>
				</div>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each fleets as project, i (project.id)}
						<div in:fly={{ y: 20, delay: i * 50, duration: 400 }}>
							<ProjectCard {project} />
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- SECTION: DRY DOCK (Experimental) -->
		{#if dryDock.length > 0}
			<section
				class="relative overflow-hidden rounded-xl border border-amber-300/40 bg-amber-50/50 px-6 py-8 dark:border-yellow-900/20 dark:bg-yellow-950/5"
			>
				<div
					class="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-amber-500/50 to-transparent dark:from-yellow-600/50"
				></div>
				<div class="mb-8 flex items-center gap-3">
					<Compass class="size-5 text-amber-600 dark:text-yellow-500" />
					<h3
						class="text-xl font-bold tracking-tight text-amber-700 uppercase dark:text-yellow-500/90"
					>
						Dry Dock
					</h3>
					<span class="ml-auto font-mono text-sm text-amber-600/80 dark:text-yellow-600/60"
						>{dryDock.length} R&D UNITS</span
					>
				</div>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{#each dryDock as project, i (project.id)}
						<div in:fly={{ y: 20, delay: i * 50, duration: 400 }}>
							<ProjectCard {project} />
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- SECTION: MANIFEST (Standard Cargo) -->
		{#if cargo.length > 0}
			<section>
				<div class="mb-8 flex items-center gap-3 border-b border-border pb-4">
					<Lordicon
						src="https://cdn.lordicon.com/rezibkiy.json"
						primaryColor="#d46211"
						secondaryColor="#475569"
						loopAfterIn={true}
						delay={300}
						size={50}
						height={50}
						target="div"
						trigger="hover"
					/>
					<h3 class="text-xl font-bold tracking-tight text-foreground uppercase">
						Vessel Manifest
					</h3>
					<span class="ml-auto font-mono text-sm text-muted-foreground">{cargo.length} UNITS</span>
				</div>

				{#if viewMode === 'grid'}
					<div
						class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						in:fly={{ y: 20, duration: 300 }}
					>
						{#each cargo as project (project.id)}
							<ProjectCard {project} />
						{/each}
					</div>
				{:else}
					<div class="space-y-1" in:fly={{ y: 20, duration: 300 }}>
						{#each cargo as project (project.id)}
							{@const langColor = project.languages[0]?.color ?? 'var(--muted-foreground)'}
							{@const langName = project.languages[0]?.name ?? '—'}
							<a
								href="/projects/{project.id}"
								class="group relative flex items-center justify-between overflow-hidden rounded-none border-2 border-foreground/15 bg-card p-3 pl-5 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[2px_2px_0px_0px] hover:shadow-primary/20 dark:border-foreground/20"
							>
								<!-- Language accent stripe -->
								<div
									class="absolute top-0 left-0 h-full w-0.75"
									style="background-color: {langColor}"
								></div>

								<div class="flex min-w-0 items-center gap-3">
									<Terminal
										class="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
									/>
									<div class="min-w-0">
										<h4 class="truncate font-mono text-base font-bold text-foreground">
											{project.name}
										</h4>
										<p class="truncate text-sm text-muted-foreground">
											{project.description || 'No description available.'}
										</p>
									</div>
								</div>
								<div
									class="flex shrink-0 items-center gap-4 font-mono text-xs tracking-wider text-muted-foreground"
								>
									<span class="hidden items-center gap-1.5 md:flex">
										<span
											class="inline-block size-2 rounded-full"
											style="background-color: {langColor}"
										></span>
										{langName}
									</span>
									<span class="flex items-center gap-1">
										<Star class="size-2.5" />
										{project.stars}
									</span>
									<span class="hidden sm:inline">
										{new Date(project.updatedAt).toLocaleDateString('en-US', {
											month: 'numeric',
											day: 'numeric',
											year: 'numeric'
										})}
									</span>
									<ChevronRight
										class="size-3.5 text-muted-foreground/50 transition-colors group-hover:text-primary"
									/>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	</main>
</div>

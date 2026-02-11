<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import {
		ArrowLeft,
		Star,
		GitMerge,
		ExternalLink,
		Globe,
		Cpu,
		Terminal,
		Calendar,
		Code,
		Wrench,
		Box,
		Zap,
		Activity,
		Book,
		Settings,
		Construction,
		Github
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';

	// Receive data from +page.server.ts
	let { data } = $props();

	// Access the project data - since it's verified by server, we can treat it as present
	// or rely on SvelteKit's error boundary if it threw 404
	const project = $derived(data.project);

	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	);

	const projectTypeConfig: Record<
		string,
		{
			label: string;
			icon: string;
			color: string;
		}
	> = {
		app: { label: 'Full-Stack App', icon: 'box', color: 'text-indigo-500' },
		api: { label: 'API/Service', icon: 'zap', color: 'text-amber-500' },
		library: { label: 'Library', icon: 'book', color: 'text-cyan-500' },
		'mcp-server': { label: 'MCP Server', icon: 'cpu', color: 'text-purple-500' },
		plugin: { label: 'Plugin', icon: 'settings', color: 'text-pink-500' },
		tool: { label: 'Developer Tool', icon: 'wrench', color: 'text-orange-500' },
		docs: { label: 'Documentation', icon: 'book', color: 'text-emerald-500' },
		framework: { label: 'Framework', icon: 'construction', color: 'text-blue-500' }
	};

	const typeConfig = $derived(
		projectTypeConfig[project.projectType || 'tool'] || projectTypeConfig['tool']
	);

	const colorClasses: Record<string, { border: string; gradient: string; text: string }> = {
		'text-indigo-500': {
			border: 'border-indigo-500/20',
			gradient: 'from-indigo-500/10 to-indigo-500/5 hover:border-indigo-500/40',
			text: 'text-indigo-500'
		},
		'text-amber-500': {
			border: 'border-amber-500/20',
			gradient: 'from-amber-500/10 to-amber-500/5 hover:border-amber-500/40',
			text: 'text-amber-500'
		},
		'text-cyan-500': {
			border: 'border-cyan-500/20',
			gradient: 'from-cyan-500/10 to-cyan-500/5 hover:border-cyan-500/40',
			text: 'text-cyan-500'
		},
		'text-purple-500': {
			border: 'border-purple-500/20',
			gradient: 'from-purple-500/10 to-purple-500/5 hover:border-purple-500/40',
			text: 'text-purple-500'
		},
		'text-pink-500': {
			border: 'border-pink-500/20',
			gradient: 'from-pink-500/10 to-pink-500/5 hover:border-pink-500/40',
			text: 'text-pink-500'
		},
		'text-orange-500': {
			border: 'border-orange-500/20',
			gradient: 'from-orange-500/10 to-orange-500/5 hover:border-orange-500/40',
			text: 'text-orange-500'
		},
		'text-emerald-500': {
			border: 'border-emerald-500/20',
			gradient: 'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/40',
			text: 'text-emerald-500'
		},
		'text-blue-500': {
			border: 'border-blue-500/20',
			gradient: 'from-blue-500/10 to-blue-500/5 hover:border-blue-500/40',
			text: 'text-blue-500'
		}
	};

	const typeColorClasses = $derived(
		colorClasses[typeConfig.color] || colorClasses['text-indigo-500']
	);

	const iconComponents: Record<string, any> = {
		box: Box,
		zap: Zap,
		book: Book,
		cpu: Cpu,
		settings: Settings,
		wrench: Wrench,
		construction: Construction,
		code: Code
	};

	const IconComponent = $derived(iconComponents[typeConfig.icon] || Code);
</script>

<svelte:head>
	<title>{project.name} - Shipyard</title>
	<meta
		name="description"
		content={project.description ||
			`${project.name} - A curated open-source project in the Shipyard registry.`}
	/>
	<meta name="keywords" content={project.topics.join(', ')} />
	<link rel="canonical" href="https://shipyard.registry/projects/{project.id}" />
	<meta property="og:title" content="{project.name} - Shipyard" />
	<meta
		property="og:description"
		content={project.description || `${project.name} - A curated open-source project.`}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shipyard.registry/projects/{project.id}" />
	<meta
		property="og:image"
		content="https://opengraph.githubassets.com/1/{project.url.replace('https://github.com/', '')}"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{project.name} - Shipyard" />
	<meta
		name="twitter:description"
		content={project.description || `${project.name} - A curated open-source project.`}
	/>
</svelte:head>

<div class="min-h-screen font-sans selection:bg-primary/20">
	<!-- Hero Section -->
	<div class="relative border-b border-primary/10 bg-secondary/5 py-12 md:py-20 lg:py-24">
		<!-- Grid Pattern Background -->
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
		></div>

		<div class="relative container mx-auto max-w-5xl px-6 md:px-12">
			<Button
				variant="ghost"
				href="/"
				class="group mb-8 pl-0 text-muted-foreground hover:bg-transparent hover:text-primary"
			>
				<ArrowLeft class="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
				<span class="font-mono text-xs tracking-widest uppercase">Return to Dock</span>
			</Button>

			<div class="grid gap-12 lg:grid-cols-[2fr_1fr]">
				<div class="space-y-6">
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<Badge
								variant="outline"
								class="border-primary/30 bg-primary/5 font-mono text-xs tracking-wider text-primary uppercase"
							>
								{project.isCluster ? 'Cluster Root' : 'Single Module'}
							</Badge>
							<span class="font-mono text-xs text-muted-foreground">ID: {project.id}</span>
						</div>
						<h1 class="text-4xl font-black tracking-tight lg:text-5xl">
							{project.name}
						</h1>
					</div>

					<p class="text-xl leading-relaxed text-muted-foreground">
						{project.description || 'No transmission data available for this module.'}
					</p>

					<div class="flex flex-wrap gap-2 pt-4">
						<Button
							size="lg"
							class="group h-12 gap-2 text-base font-semibold shadow-lg shadow-primary/20"
							href={project.url}
							target="_blank"
						>
							{#if project.isCluster}
								<Globe class="size-4 transition-transform group-hover:scale-110" />
								View Organization
							{:else}
								<Github class="size-4 transition-transform group-hover:scale-110" />
								Launch Repository
							{/if}
						</Button>
						<div
							class="flex items-center gap-3 rounded-lg border {typeColorClasses.border} bg-linear-to-br {typeColorClasses.gradient} px-4 py-3 backdrop-blur-sm transition-all hover:shadow-lg"
						>
							<IconComponent class={`size-5 ${typeConfig.color}`} strokeWidth={1.5} />
							<span class="text-sm font-medium">{typeConfig.label}</span>
						</div>
					</div>
				</div>

				<!-- Stats Matrix -->
				<div class="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm lg:col-start-2">
					<h3
						class="mb-4 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase"
					>
						System Metrics
					</h3>
					<div class="space-y-6">
						<div class="flex items-center justify-between border-b border-border/50 pb-4">
							<span class="flex items-center gap-2 text-sm font-medium">
								<Star class="size-4 text-yellow-500" /> Stars
							</span>
							<span class="font-mono text-lg font-bold">{project.stars}</span>
						</div>
						<div class="flex items-center justify-between border-b border-border/50 pb-4">
							<span class="flex items-center gap-2 text-sm font-medium">
								<Calendar class="size-4 text-blue-500" /> Updated
							</span>
							<span class="font-mono text-sm">{date}</span>
						</div>
						<div class="space-y-3 pt-2">
							<span class="flex items-center gap-2 text-sm font-medium">
								<Cpu class="size-4 text-purple-500" /> Stack
							</span>
							<div class="flex flex-wrap gap-2">
								{#each project.languages as lang}
									<div
										class="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs"
									>
										<span class="size-1.5 rounded-full" style="background-color: {lang.color}"
										></span>
										{lang.name}
									</div>
								{/each}
								{#if project.languages.length === 0}
									<span class="text-xs text-muted-foreground italic">Unknown</span>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-5xl px-6 py-12 md:px-12">
		<div class="grid gap-12 lg:grid-cols-[1fr_300px]">
			<div class="space-y-12">
				<!-- About / Readme Simulation -->
				<section class="space-y-4">
					<h2
						class="font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase"
					>
						// Transmission Log
					</h2>
					<div class="prose prose-invert max-w-none rounded-xl border border-border bg-card/30 p-8">
						<p>
							{project.description}
						</p>
						<p class="text-muted-foreground/60 italic">
							Full documentation and source code streams are available in the repository uplink.
						</p>
					</div>
				</section>

				<!-- Project Type Info Section -->
				<section class="space-y-6">
					<div class="flex items-center justify-between">
						<h2
							class="font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase"
						>
							// Project Information
						</h2>
						<span class="text-xs text-muted-foreground/60">Details & Stack</span>
					</div>

					<!-- Main Info Grid -->
					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<!-- Project Type Card -->
						<div
							class="group relative overflow-hidden rounded-lg border {typeColorClasses.border} bg-linear-to-brtypeColorClasses.gradient} p-6 backdrop-blur-sm transition-all hover:shadow-lg"
						>
							<div class="relative z-10 space-y-3">
								<div class="flex items-start justify-between">
									<IconComponent
										class={`size-6 ${typeConfig.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}
										strokeWidth={1.5}
									/>
									<span class={`rounded-full px-2 py-1 text-xs font-semibold ${typeConfig.color}`}>
										{typeConfig.label}
									</span>
								</div>
								<div>
									<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
										Project Type
									</p>
									<p class="mt-1 text-sm font-semibold text-foreground">{typeConfig.label}</p>
								</div>
							</div>
						</div>

						<!-- Language Stack Card -->
						{#if project.languages.length > 0}
							<div
								class="group relative overflow-hidden rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-500/10 to-cyan-500/5 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:shadow-lg"
							>
								<div class="relative z-10 space-y-3">
									<div class="flex items-start justify-between">
										<Code
											class="size-6 text-cyan-500 transition-transform group-hover:scale-110"
											strokeWidth={1.5}
										/>
										<span
											class="rounded-full bg-linear-to-br from-cyan-500/10 to-cyan-500/5 px-2 py-1 text-xs font-semibold text-cyan-500"
										>
											Stack
										</span>
									</div>
									<div>
										<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
											Technology Stack
										</p>
										<div class="mt-2 flex flex-wrap gap-1.5">
											{#each project.languages.slice(0, 2) as lang}
												<Badge variant="secondary" class="text-xs font-medium">
													{lang.name}
												</Badge>
											{/each}
											{#if project.languages.length > 2}
												<Badge variant="secondary" class="text-xs font-medium">
													+{project.languages.length - 2}
												</Badge>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/if}

						<!-- Stats Card -->
						<div
							class="group relative overflow-hidden rounded-lg border border-yellow-500/20 bg-linear-to-br from-yellow-500/10 to-yellow-500/5 p-6 backdrop-blur-sm transition-all hover:border-yellow-500/40 hover:shadow-lg"
						>
							<div class="relative z-10 space-y-3">
								<div class="flex items-start justify-between">
									<Star
										class="size-6 text-yellow-500 transition-transform group-hover:scale-110 group-hover:rotate-12"
										fill="currentColor"
										strokeWidth={1.5}
									/>
									<span
										class="rounded-full bg-linear-to-br from-yellow-500/10 to-yellow-500/5 px-2 py-1 text-xs font-semibold text-yellow-500"
									>
										Popularity
									</span>
								</div>
								<div>
									<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
										Stars
									</p>
									<p class="mt-1 text-lg font-bold text-foreground">
										{project.stars.toLocaleString()}
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Last Updated Info -->
					<div
						class="flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-4 py-3 backdrop-blur-sm"
					>
						<Calendar class="size-4 text-muted-foreground/60" strokeWidth={1.5} />
						<span class="text-sm text-muted-foreground"
							>Last updated <span class="font-semibold text-foreground">{date}</span></span
						>
					</div>
				</section>

				<!-- Cluster Content -->
				{#if project.isCluster && project.subProjects}
					<section class="space-y-6">
						<div class="flex items-center justify-between">
							<h2
								class="font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase"
							>
								// Modules ({project.subProjects.length})
							</h2>
						</div>

						<div class="grid gap-4">
							{#each project.subProjects as module}
								<Card.Root
									class="group relative overflow-hidden border border-border bg-card/40 transition-all hover:border-primary/30 hover:bg-card/80"
								>
									<div class="flex items-center justify-between p-6">
										<div class="flex items-center gap-5">
											<div
												class="rounded-lg border border-primary/10 bg-secondary/30 p-3 text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/10"
											>
												<GitMerge class="size-5" />
											</div>
											<div>
												<h4 class="text-lg font-bold transition-colors group-hover:text-primary">
													{module.name}
												</h4>
												<p class="mt-1 line-clamp-1 text-sm text-muted-foreground">
													{module.description}
												</p>
											</div>
										</div>

										<div class="flex items-center gap-4">
											<div class="hidden text-right sm:block">
												<div class="font-mono text-xs text-muted-foreground">Updated</div>
												<div class="text-sm">{new Date(module.updatedAt).toLocaleDateString()}</div>
											</div>
											<Button
												size="icon"
												variant="outline"
												class="h-9 w-9"
												href={module.url}
												target="_blank"
											>
												<ExternalLink class="size-4" />
											</Button>
										</div>
									</div>
								</Card.Root>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			<!-- Sidebar (Tags) -->
			<aside class="space-y-8">
				<div class="space-y-4">
					<h2
						class="font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase"
					>
						// Topics
					</h2>
					<div class="flex flex-wrap gap-2">
						{#each project.topics as topic}
							<Badge
								variant="secondary"
								class="rounded-md border border-border bg-secondary/50 font-mono text-xs hover:bg-secondary"
							>
								{topic}
							</Badge>
						{/each}
						{#if project.topics.length === 0}
							<span class="text-sm text-muted-foreground">No topics tagged.</span>
						{/if}
					</div>
				</div>
			</aside>
		</div>
	</div>
</div>

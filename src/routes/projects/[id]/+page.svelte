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
		Calendar
	} from 'lucide-svelte';

	let { data } = $props();
	let project = $derived(data.project);

	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	);
</script>

<div class="min-h-screen bg-background font-sans selection:bg-primary/20">
	<!-- Hero Section -->
	<div class="relative border-b border-primary/10 bg-secondary/5 py-12 md:py-20 lg:py-24">
		<!-- Grid Pattern Background -->
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
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

					<div class="flex flex-wrap gap-3 pt-2">
						<Button
							size="lg"
							class="group h-12 gap-2 text-base font-semibold shadow-lg shadow-primary/20"
							href={project.url}
							target="_blank"
						>
							{#if project.isCluster}
								<Globe class="size-4" /> View Organization
							{:else}
								<ExternalLink class="size-4" /> Launch Repository
							{/if}
						</Button>
						{#if !project.isCluster}
							<div
								class="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-mono text-sm text-muted-foreground"
							>
								<Terminal class="size-4" />
								<span>npm install {project.name.toLowerCase()}</span>
							</div>
						{/if}
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

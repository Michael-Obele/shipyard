<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import { ArrowLeft, Star, GitMerge, ExternalLink, Calendar } from 'lucide-svelte';

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

<div class="min-h-screen bg-background p-6 font-sans md:p-12">
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Navigation -->
		<Button
			variant="ghost"
			href="/"
			class="group gap-2 pl-0 hover:bg-transparent hover:text-primary"
		>
			<ArrowLeft class="size-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-sm tracking-wider uppercase">Return to Dock</span>
		</Button>

		<!-- Header -->
		<div class="space-y-4">
			<div class="flex items-start justify-between">
				<div class="space-y-2">
					<div class="flex items-center gap-3">
						<h1 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
							{project.name}
						</h1>
						<Badge variant="outline" class="border-primary/20 font-mono text-sm text-primary">
							{project.isCluster ? 'CLUSTER ROOT' : 'SINGLE MODULE'}
						</Badge>
					</div>
					<p class="max-w-2xl text-xl leading-relaxed text-muted-foreground">
						{project.description}
					</p>
				</div>
				<!-- Stats -->
				<div
					class="flex items-center gap-6 border-l border-border pl-6 font-mono text-sm text-muted-foreground/80"
				>
					<div class="flex flex-col items-end">
						<span class="text-xs uppercase opacity-70">Stars</span>
						<div class="flex items-center gap-1.5 text-foreground">
							<Star class="size-3.5 text-primary" />
							<span>{project.stars}</span>
						</div>
					</div>
					<div class="flex flex-col items-end">
						<span class="text-xs uppercase opacity-70">Updated</span>
						<span class="text-foreground">{date}</span>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap gap-2 pt-2">
				{#each project.topics as topic}
					<Badge variant="secondary" class="rounded-full px-3 py-1 font-mono text-xs">{topic}</Badge
					>
				{/each}
			</div>
		</div>

		<Separator class="bg-border/60" />

		<!-- Cluster Content or Single Project Details -->
		{#if project.isCluster && project.subProjects}
			<div class="grid grid-cols-1 gap-4">
				<h3
					class="mb-2 font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase"
				>
					Included Modules ({project.subProjects.length})
				</h3>
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
		{/if}
	</div>
</div>

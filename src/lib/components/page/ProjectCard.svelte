<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import type { DisplayProject } from '$lib/types';
	import { Star, Clock, Layers, Box, ExternalLink } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let { project }: { project: DisplayProject } = $props();

	// Format date relative or simple
	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
	);

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
			num
		);
	}
</script>

<HoverCard.Root openDelay={200}>
	<HoverCard.Trigger
		class={cn(
			'group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/50 text-card-foreground shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:scale-102 hover:shadow-lg',
			project.featured ? 'col-span-1 row-span-1 md:col-span-2 md:row-span-2' : 'col-span-1'
		)}
	>
		<!-- Machined Glow Effect -->
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			style="background: radial-gradient(circle at top left, hsla(var(--primary) / 0.15), transparent 70%);"
		></div>

		<Card.Header>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					{#if project.isCluster}
						<Layers class="size-5 text-primary" />
					{:else}
						<Box class="size-5 text-muted-foreground" />
					{/if}
					<Card.Title class="text-lg font-bold tracking-tight">{project.name}</Card.Title>
				</div>
				{#if project.featured}
					<Badge
						variant="secondary"
						class="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20"
					>
						Featured
					</Badge>
				{/if}
			</div>
			<Card.Description class="mt-2 line-clamp-2">
				{project.description || 'No description provided.'}
			</Card.Description>
		</Card.Header>

		<Card.Content class="grow">
			<div class="mt-4 flex flex-wrap gap-2">
				{#each project.topics.slice(0, 3) as topic}
					<Badge variant="outline" class="font-mono text-xs">{topic}</Badge>
				{/each}
			</div>
		</Card.Content>

		<Card.Footer class="border-t border-border/50 bg-secondary/30 p-4">
			<div class="flex w-full items-center justify-between font-mono text-xs text-muted-foreground">
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-1">
						<Star class="size-3.5" />
						<span>{formatNumber(project.stars)}</span>
					</div>
					<div class="flex items-center gap-1">
						<Clock class="size-3.5" />
						<span>{date}</span>
					</div>
				</div>
				{#if project.languages.length > 0}
					<div class="flex items-center gap-2">
						<span class="size-2 rounded-full" style="background-color: {project.languages[0].color}"
						></span>
						<span>{project.languages[0].name}</span>
					</div>
				{/if}
			</div>
		</Card.Footer>
	</HoverCard.Trigger>

	<HoverCard.Content
		class="w-80 animate-in rounded-xl border bg-popover p-4 text-popover-foreground shadow-md fade-in-0 outline-none zoom-in-95"
	>
		<div class="flex justify-between space-x-4">
			<div class="space-y-1">
				<h4 class="text-sm font-semibold">@{project.id}</h4>
				<p class="text-sm">
					{#if project.isCluster}
						Cluster containing {project.repoCount} repositories.
					{:else}
						Main repository.
					{/if}
				</p>
				<div class="flex items-center pt-2">
					<span class="text-xs text-muted-foreground">
						Last active {date}
					</span>
				</div>
			</div>
		</div>
		<div class="mt-4 flex gap-2">
			<a
				href={project.url}
				target="_blank"
				rel="noreferrer"
				class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
			>
				<ExternalLink class="mr-2 size-4" />
				View Repo
			</a>
		</div>
	</HoverCard.Content>
</HoverCard.Root>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { DisplayProject } from '$lib/types';
	import { Star, GitBranch } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { project }: { project: DisplayProject } = $props();

	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric' // 2-digit year? no, keep full for clarity
		})
	);
</script>

<a href="/projects/{project.id}" class="group block h-full">
	<Card.Root
		class="flex h-full flex-col border-border/60 transition-all duration-300 hover:border-primary/50 hover:bg-card/70 hover:shadow-lg"
	>
		<Card.Header class="pb-2">
			<div class="flex items-start justify-between gap-2">
				<div class="flex items-center gap-2">
					<GitBranch
						class="size-4 text-muted-foreground transition-colors group-hover:text-primary"
					/>
					<Card.Title
						class="text-base leading-none font-bold decoration-primary/50 underline-offset-4 group-hover:underline"
						>{project.name}</Card.Title
					>
				</div>
				{#if project.featured}
					<div class="size-2 animate-pulse rounded-full bg-indigo-500"></div>
				{/if}
			</div>
		</Card.Header>
		<Card.Content class="grow">
			<p class="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
				{project.description || 'No description available.'}
			</p>
		</Card.Content>
		<Card.Footer
			class="mt-auto flex items-center justify-between border-t border-border/30 pt-2 pb-4 font-mono text-xs text-muted-foreground"
		>
			<div class="flex items-center gap-2">
				{#if project.languages.length > 0}
					<span class="flex items-center gap-1.5">
						<span class="size-2 rounded-full" style="background-color: {project.languages[0].color}"
						></span>
						{project.languages[0].name}
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-3 opacity-60 transition-opacity group-hover:opacity-100">
				<div class="flex items-center gap-1">
					<span>★</span>
					{project.stars}
				</div>
				<div>
					{date}
				</div>
			</div>
		</Card.Footer>
	</Card.Root>
</a>

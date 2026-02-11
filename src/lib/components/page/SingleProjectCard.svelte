<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { DisplayProject } from '$lib/types';
	import { Terminal, Star, ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let { project }: { project: DisplayProject } = $props();

	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric'
		})
	);

	let langColor = $derived(project.languages[0]?.color ?? 'var(--muted-foreground)');
	let langName = $derived(project.languages[0]?.name ?? '—');

	// Map projectType to a short label
	const typeLabels: Record<string, string> = {
		app: 'APP',
		api: 'API',
		library: 'LIB',
		'mcp-server': 'MCP',
		plugin: 'PLG',
		tool: 'TOOL',
		docs: 'DOC',
		framework: 'FWK'
	};

	let typeLabel = $derived(
		project.projectType
			? (typeLabels[project.projectType] ?? project.projectType.toUpperCase())
			: null
	);
</script>

<a href="/projects/{project.id}" class="group block h-full">
	<!-- Hard shadow wrapper — neubrutalist offset (mirrors ClusterProjectCard) -->
	<div
		class="relative h-full transition-all duration-150 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
	>
		<Card.Root
			class="relative flex h-full flex-col overflow-hidden rounded-none border-2 border-foreground/15 bg-card shadow-[2px_2px_0px_0px] shadow-primary/15 transition-shadow duration-150 group-hover:shadow-[3px_3px_0px_0px] group-hover:shadow-primary/30 dark:border-foreground/20 dark:shadow-primary/10 dark:group-hover:shadow-primary/25"
		>
			<!-- ═══ LANGUAGE ACCENT STRIPE ═══ -->
			<div class="absolute top-0 left-0 h-full w-0.75" style="background-color: {langColor}"></div>

			<!-- ═══ HEADER ═══ -->
			<Card.Header class="pb-2 pl-5">
				<div class="flex items-start justify-between gap-2">
					<div class="flex items-center gap-2">
						<Terminal
							class="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
						/>
						<Card.Title
							class="font-mono text-sm leading-tight font-bold tracking-tight decoration-primary/50 underline-offset-4 group-hover:underline"
							>{project.name}</Card.Title
						>
					</div>
					{#if typeLabel}
						<Badge
							variant="outline"
							class="shrink-0 rounded-none border-foreground/15 px-1.5 py-0 font-mono text-[9px] tracking-widest text-muted-foreground"
						>
							{typeLabel}
						</Badge>
					{:else if project.featured}
						<div class="size-1.5 shrink-0 rounded-full bg-primary"></div>
					{/if}
				</div>
			</Card.Header>

			<!-- ═══ CONTENT ═══ -->
			<Card.Content class="grow pt-0 pl-5">
				<p class="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
					{project.description || 'No description available.'}
				</p>
			</Card.Content>

			<!-- ═══ FOOTER DATA STRIP ═══ -->
			<Card.Footer
				class="flex items-center justify-between border-t-2 border-foreground/10 bg-muted/50 px-4 py-2 pl-5 dark:bg-muted/30"
			>
				<!-- Language -->
				<span
					class="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground"
				>
					<span class="inline-block size-2 rounded-full" style="background-color: {langColor}"
					></span>
					{langName}
				</span>

				<!-- Stars + Date -->
				<div
					class="flex items-center gap-3 font-mono text-[10px] tracking-wider text-muted-foreground"
				>
					<span class="flex items-center gap-1">
						<Star class="size-2.5" />
						{project.stars}
					</span>
					<span>{date}</span>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</a>

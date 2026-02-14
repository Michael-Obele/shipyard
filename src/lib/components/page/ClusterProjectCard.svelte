<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { DisplayProject } from '$lib/types';
	import { Container, ArrowRight, CalendarDays, Star, Sparkles, TrendingUp, Archive } from '@lucide/svelte';
	import * as HoverCard from '$lib/components/ui/hover-card';

	let { project }: { project: DisplayProject } = $props();

	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
	);

	let totalStars = $derived(
		(project.subProjects ?? []).reduce((sum, s) => sum + (s.stars ?? 0), 0) + project.stars
	);
</script>

<div class="group block h-full cursor-pointer text-left">
	<!-- Hard shadow wrapper — neubrutalist offset -->
	<div
		class="relative h-full transition-all duration-150 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
	>
		<Card.Root
			class="relative flex h-full flex-col overflow-hidden rounded-none border-2 border-foreground/15 bg-card shadow-[3px_3px_0px_0px] shadow-primary/25 transition-shadow duration-150 group-hover:shadow-[5px_5px_0px_0px] group-hover:shadow-primary/40 dark:border-foreground/20 dark:shadow-primary/15 dark:group-hover:shadow-primary/30"
		>
			<!-- ═══ TOP LABEL STRIP ═══ -->
			<div
				class="flex items-center justify-between border-b-2 border-foreground/10 bg-primary px-4 py-1.5 dark:border-foreground/15"
			>
				<div class="flex items-center gap-2">
					<Container class="size-3.5 text-primary-foreground/80" />
					<span
						class="font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase"
					>
						GROUP
					</span>
				</div>
				<span
					class="font-mono text-[11px] font-medium tracking-wider text-primary-foreground/70 uppercase"
				>
					{project.repoCount} modules
				</span>
			</div>

			<!-- ═══ TITLE ZONE ═══ -->
			<Card.Header class="rounded-none pb-2">
				<div class="flex items-start justify-between">
					<Card.Title class="font-mono text-xl leading-tight font-black tracking-tight">
						{project.name}
					</Card.Title>
					<div class="flex flex-col items-end gap-1">
						{#if project.isNew}
							<Badge
								class="rounded-none border-white/20 bg-white/10 px-1.5 py-0 font-mono text-[9px] font-bold tracking-wider text-white hover:bg-white/20"
							>
								<Sparkles class="mr-1 size-2.5" />
								NEW
							</Badge>
						{/if}
						{#if project.isTrending}
							<Badge
								class="rounded-none border-white/20 bg-white/10 px-1.5 py-0 font-mono text-[9px] font-bold tracking-wider text-white hover:bg-white/20"
							>
								<TrendingUp class="mr-1 size-2.5" />
								TRENDING
							</Badge>
						{/if}
						{#if project.isArchived}
							<Badge
								class="rounded-none border-white/20 bg-white/10 px-1.5 py-0 font-mono text-[9px] font-bold tracking-wider text-white hover:bg-white/20"
							>
								<Archive class="mr-1 size-2.5" />
								ARCHIVED
							</Badge>
						{/if}
					</div>
				</div>
			</Card.Header>

			<!-- ═══ CONTENT ═══ -->
			<Card.Content class="flex grow flex-col gap-3 pt-0">
				<p class="line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">
					{project.description}
				</p>

				<!-- ── MANIFEST DIVIDER ── -->
				<div class="flex items-center gap-3">
					<span class="h-px flex-1 bg-foreground/10"></span>
					<span
						class="font-mono text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase"
					>
						manifest
					</span>
					<span class="h-px flex-1 bg-foreground/10"></span>
				</div>

				<!-- ── NUMBERED SUB-PROJECT LIST ── -->
				{#if project.subProjects && project.subProjects.length > 0}
					<div class="space-y-0.5">
						{#each project.subProjects.slice(0, 4) as sub, i (sub.name)}
							<div
								onclick={(e) => e.stopPropagation()}
								onkeydown={(e) => e.stopPropagation()}
								role="presentation"
							>
								<HoverCard.Root openDelay={200}>
									<HoverCard.Trigger
										class="flex w-full items-center gap-2 border-l-2 border-transparent px-2 py-1 text-left font-mono transition-colors hover:border-l-primary hover:bg-primary/5"
									>
										<span class="w-5 text-xs text-muted-foreground/50 tabular-nums">
											{String(i + 1).padStart(2, '0')}
										</span>
										<span class="truncate text-sm text-foreground/80">
											{sub.name}
										</span>
									</HoverCard.Trigger>
									<HoverCard.Content class="w-72 rounded-none border-2 border-foreground/15">
										<div class="space-y-2">
											<h4 class="font-mono text-base font-bold">@{sub.name}</h4>
											<p class="text-[15px] text-muted-foreground">
												{sub.description || 'No description provided.'}
											</p>
											{#if sub.stars > 0}
												<div
													class="flex items-center gap-1 font-mono text-xs text-muted-foreground"
												>
													<Star class="size-3" />
													<span>{sub.stars}</span>
												</div>
											{/if}
											<div class="flex items-center gap-1.5 pt-1">
												<CalendarDays class="size-3 text-muted-foreground/70" />
												<span class="font-mono text-xs text-muted-foreground">
													{new Date(sub.updatedAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									</HoverCard.Content>
								</HoverCard.Root>
							</div>
						{/each}
						{#if project.subProjects.length > 4}
							<span class="block px-2 py-1 font-mono text-[10px] text-muted-foreground/50">
								+{project.subProjects.length - 4} more
							</span>
						{/if}
					</div>
				{/if}

				<!-- ── CTA ── -->
				<Button
					variant="outline"
					size="sm"
					href={`/projects/${project.id}`}
					class="mt-auto w-full rounded-none border-2 border-foreground/15 font-mono text-sm font-bold tracking-wider uppercase transition-all hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
				>
					Inspect Fleet
					<ArrowRight class="size-3.5" />
				</Button>
			</Card.Content>

			<!-- ═══ FOOTER DATA STRIP ═══ -->
			<Card.Footer
				class="flex items-center justify-between border-t-2 border-foreground/10 bg-muted/50 px-4 py-2 dark:bg-muted/30"
			>
				<span class="font-mono text-xs tracking-wider text-muted-foreground uppercase">
					upd: {date}
				</span>
				{#if totalStars > 0}
					<span
						class="flex items-center gap-1 font-mono text-xs tracking-wider text-muted-foreground"
					>
						<Star class="size-3" />
						{totalStars}
					</span>
				{/if}
			</Card.Footer>
		</Card.Root>
	</div>
</div>

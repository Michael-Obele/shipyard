<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { DisplayProject } from '$lib/types';
	import { Boxes, FolderGit, CalendarDays } from '@lucide/svelte';
	import * as HoverCard from '$lib/components/ui/hover-card';

	let { project }: { project: DisplayProject } = $props();

	let date = $derived(
		new Date(project.updatedAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
	);
</script>

<a href="/projects/{project.id}" class="group block h-full">
	<!-- Stack Effect Container -->
	<div class="relative h-full transition-transform duration-300 md:group-hover:-translate-y-1">
		<!-- Background Layer (Stack Illusion) -->
		<div
			class="absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-xl border border-primary/5 bg-primary/10 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3"
		></div>
		<div
			class="absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-xl border border-border/50 bg-secondary transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
		></div>

		<Card.Root
			class="relative h-full overflow-hidden rounded-xl border border-primary/20 bg-card/90 backdrop-blur-sm transition-all duration-300 ease-out group-hover:border-primary/50 group-hover:shadow-xl"
		>
			<div class="absolute top-0 right-0 p-3 opacity-50 transition-opacity group-hover:opacity-100">
				<FolderGit class="size-5 text-primary" />
			</div>

			<Card.Header class="pb-2">
				<div class="space-y-1">
					<Badge
						variant="outline"
						class="w-fit border-primary/30 font-mono text-[10px] text-primary">GROUP</Badge
					>
					<Card.Title class="text-xl font-bold tracking-tight">{project.name}</Card.Title>
				</div>
			</Card.Header>

			<Card.Content>
				<p class="mb-4 line-clamp-2 text-sm text-muted-foreground">
					{project.description}
				</p>

				<div class="space-y-3">
					<div
						class="flex items-center gap-2 rounded-md bg-secondary/50 p-2 font-mono text-xs text-muted-foreground"
					>
						<Boxes class="size-3.5" />
						<span>{project.repoCount} Modules Included</span>
					</div>
					<div class="flex flex-wrap gap-1.5">
						{#if project.subProjects}
							{#each project.subProjects.slice(0, 3) as sub (sub.name)}
								<HoverCard.Root openDelay={200}>
									<HoverCard.Trigger
										class="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-2 py-0.5 transition-colors hover:bg-secondary/80"
									>
										<span class="size-1.5 rounded-full bg-primary/40"></span>
										<span class="max-w-25 truncate text-[10px] text-muted-foreground"
											>{sub.name}</span
										>
									</HoverCard.Trigger>
									<HoverCard.Content class="w-80">
										<div class="flex justify-between space-x-4">
											<div class="space-y-1">
												<h4 class="text-sm font-semibold">@{sub.name}</h4>
												<p class="text-sm">
													{sub.description || 'No description provided.'}
												</p>
												<div class="flex items-center pt-2">
													<CalendarDays class="mr-2 size-4 opacity-70" />
													<span class="text-xs text-muted-foreground">
														Updated {new Date(sub.updatedAt).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
									</HoverCard.Content>
								</HoverCard.Root>
							{/each}
							{#if project.subProjects.length > 3}
								<span class="pl-1 text-[10px] text-muted-foreground"
									>+{project.subProjects.length - 3}</span
								>
							{/if}
						{/if}
					</div>
				</div>
			</Card.Content>

			<Card.Footer class="mt-auto border-t border-primary/10 bg-primary/5 px-4 py-2">
				<span class="font-mono text-[10px] tracking-widest text-primary/70 uppercase">
					Last Update: {date}
				</span>
			</Card.Footer>
		</Card.Root>
	</div>
</a>

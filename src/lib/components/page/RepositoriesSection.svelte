<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Github, GitBranch, Star, AlertCircle, Loader2 } from '@lucide/svelte';
	import type { RepoData } from '$lib/types';

	interface Props {
		clusterName: string;
		title: string;
		description: string;
		repos?: RepoData[];
		isLoading?: boolean;
		error?: string;
	}

	const { clusterName, title, description, repos = [], isLoading = false, error = null } = $props();

	// Format number with commas
	const formatNumber = (num: number) => num.toLocaleString();
</script>

<section>
	<div class="mb-8 space-y-4 pt-12">
		<div class="space-y-1">
			<h3 class="text-2xl font-bold tracking-tight text-foreground uppercase">
				{title}
			</h3>
			<p class="font-mono text-xs tracking-wider text-muted-foreground uppercase opacity-70">
				{description}
			</p>
		</div>
	</div>

	{#if error}
		<div class="flex gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-6">
			<AlertCircle class="mt-0.5 size-5 shrink-0 text-red-500" />
			<div>
				<h4 class="font-semibold text-red-900 dark:text-red-200">Failed to load repositories</h4>
				<p class="mt-1 text-sm text-red-800 dark:text-red-300">{error}</p>
			</div>
		</div>
	{:else if isLoading}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(3) as _}
				<div class="h-64 animate-pulse rounded-lg border border-border bg-secondary/50"></div>
			{/each}
		</div>
	{:else if repos.length === 0}
		<div class="rounded-lg border border-border bg-card/50 p-8 text-center">
			<p class="text-muted-foreground">No repositories found for this cluster</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each repos as repo (repo.id)}
				<Card
					class="group relative overflow-hidden border-border bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/80 hover:shadow-lg"
				>
					<div
						class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
					></div>

					<CardHeader>
						<div class="flex items-start justify-between gap-2">
							<div class="flex-1">
								<CardTitle class="text-lg transition-colors group-hover:text-primary">
									{repo.name}
								</CardTitle>
								{#if repo.language}
									<CardDescription class="mt-2 flex items-center gap-2">
										<span
											class="inline-block h-2 w-2 rounded-full"
											style={`background-color: ${repo.color || '#e5e7eb'}`}
										></span>
										{repo.language}
									</CardDescription>
								{/if}
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<div class="space-y-4">
							{#if repo.description}
								<p class="line-clamp-2 text-sm text-muted-foreground">
									{repo.description}
								</p>
							{/if}

							{#if repo.topics && repo.topics.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each repo.topics.slice(0, 3) as topic}
										<Badge variant="secondary" class="text-xs">
											{topic}
										</Badge>
									{/each}
									{#if repo.topics.length > 3}
										<Badge variant="outline" class="text-xs">
											+{repo.topics.length - 3}
										</Badge>
									{/if}
								</div>
							{/if}

							<div class="flex items-center gap-4 pt-2 font-mono text-xs text-muted-foreground">
								<div class="flex items-center gap-1.5">
									<Star class="size-3.5" />
									<span>{formatNumber(repo.stars)}</span>
								</div>
								<div class="flex items-center gap-1.5">
									<GitBranch class="size-3.5" />
									<time class="text-xs opacity-70" title={repo.updatedAt}>
										{new Date(repo.updatedAt).toLocaleDateString()}
									</time>
								</div>
							</div>
						</div>
					</CardContent>

					<CardFooter>
						<a
							href={repo.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
						>
							<Github class="size-3.5" />
							View on GitHub
							<svg
								class="-ml-1 size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</CardFooter>
				</Card>
			{/each}
		</div>
	{/if}
</section>

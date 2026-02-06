<script lang="ts">
	import {
		Anchor,
		Zap,
		Layers,
		Box,
		Database,
		Binary,
		Hammer,
		Info,
		Github,
		Globe,
		Terminal
	} from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { fade, fly } from 'svelte/transition';

	const philosophy = [
		{
			title: 'Structural Sincerity',
			description:
				'We celebrate the grid and the border. Using Slate-800 borders and primary-glows to create a "machined" feel.',
			icon: Layers,
			color: 'text-blue-500'
		},
		{
			title: 'Bento Logic',
			description:
				'Curation via size. High-impact projects occupy larger Bento cells, ensuring the most significant work stands out.',
			icon: Box,
			color: 'text-indigo-500'
		},
		{
			title: 'Kinetic Weight',
			description:
				'Interaction is weighted and deliberate, using Svelte transitions and hover states to create a physical presence.',
			icon: Zap,
			color: 'text-amber-500'
		},
		{
			title: 'Hybrid Intelligence',
			description:
				'Merging the reliability of automated GitHub stats with the nuance of human-curated metadata.',
			icon: Binary,
			color: 'text-emerald-500'
		}
	];

	const stack = [
		{
			name: 'Svelte 5',
			icon: Zap,
			label: 'Runes & Snippets',
			details: 'The latest evolution of Svelte, bringing fine-grained reactivity through Runes.'
		},
		{
			name: 'Bun',
			icon: Terminal,
			label: 'Fast Runtime',
			details: 'All-in-one JavaScript runtime & package manager for speed and efficiency.'
		},
		{
			name: 'Tailwind CSS v4',
			icon: Globe,
			label: 'Design System',
			details: 'Utility-first CSS with native OKLCH support and improved performance.'
		},
		{
			name: 'Prisma',
			icon: Database,
			label: 'ORM',
			details: 'Next-generation ORM for Node.js and TypeScript, ensuring type-safe DB access.'
		},
		{
			name: 'PostgreSQL',
			icon: Database,
			label: 'Database',
			details: 'Reliable relational database powering the project registry.'
		},
		{
			name: 'Lucide',
			icon: Hammer,
			label: 'Icons',
			details: 'Beautifully simple, pixel-perfect icons for modern interfaces.'
		}
	];
</script>

<svelte:head>
	<title>About | Shipyard</title>
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-20">
	<!-- Hero Section -->
	<section class="mb-24 text-center" in:fade={{ duration: 800 }}>
		<Badge variant="outline" class="mb-4 border-primary/20 bg-primary/5 text-primary"
			>PROJECT REGISTRY BLUEPRINT</Badge
		>
		<h1 class="mb-6 text-5xl font-black tracking-tighter md:text-7xl">
			THE <span class="bg-linear-to-r from-primary to-indigo-400 bg-clip-text text-transparent"
				>MECHANICAL</span
			> ARTISAN
		</h1>
		<p class="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
			Shipyard is a unified, high-performance project showcase system designed to elevate
			engineering portfolios into product-focused registries.
		</p>
	</section>

	<!-- Philosophy Bento -->
	<section class="mb-32">
		<div class="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
			<h2 class="text-3xl font-bold tracking-tight">Design Philosophy</h2>
			<div class="h-px flex-1 bg-slate-800 md:mx-8"></div>
			<p class="max-w-xs text-sm text-muted-foreground">
				Rejecting flat design for an aesthetic that celebrates the structure of software.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each philosophy as item, i (item.title)}
				<div
					in:fly={{ y: 20, delay: 100 * i, duration: 600 }}
					class="group relative overflow-hidden rounded-xl border border-slate-800 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
				>
					<div
						class="absolute -top-4 -right-4 opacity-5 transition-transform group-hover:scale-110 group-hover:opacity-10"
					>
						<item.icon size={120} />
					</div>

					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-800 bg-secondary/50 transition-colors group-hover:border-primary/50"
					>
						<item.icon class="size-6 {item.color}" />
					</div>

					<h3 class="mb-2 text-xl font-bold">{item.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						{item.description}
					</p>

					<div
						class="mt-6 flex items-center gap-2 overflow-hidden opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="h-px w-8 bg-primary"></div>
						<span class="text-[10px] font-bold tracking-widest text-primary uppercase"
							>Principle {i + 1}</span
						>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Mission & Tech -->
	<div class="grid gap-12 lg:grid-cols-2">
		<!-- The Mission -->
		<section in:fly={{ x: -20, delay: 400 }}>
			<Card.Root class="h-full border-slate-800 bg-card/30 backdrop-blur-md">
				<Card.Header>
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
					>
						<Info class="size-5" />
					</div>
					<Card.Title class="text-2xl">Beyond the Portfolio</Card.Title>
					<Card.Description>Shifting from repo dumping to product curation.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4 text-muted-foreground">
					<p>
						Generic portfolios often fail to convey the complexity and interconnectedness of modern
						engineering projects. A repository is a collection of code; a **Registry** is a
						collection of products.
					</p>
					<p>
						Shipyard was conceived as a "Mechanical Artisan" workstation. It celebrates the
						industrial sincerity of the grid, the border, and the component. Every entry is treated
						with the same weight as a standalone product.
					</p>
					<Separator class="bg-slate-800" />
					<div class="flex items-center gap-4 py-2">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="text-xs font-medium text-foreground">High Performance</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-blue-500"></div>
							<span class="text-xs font-medium text-foreground">Verified Data</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-indigo-500"></div>
							<span class="text-xs font-medium text-foreground">Bento Layouts</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Tech Stack -->
		<section in:fly={{ x: 20, delay: 600 }}>
			<div class="rounded-xl border border-slate-800 bg-background p-8">
				<h2 class="mb-8 flex items-center gap-3 text-2xl font-bold">
					<Terminal class="size-6 text-primary" />
					The Engine Room
				</h2>
				<div class="grid grid-cols-2 gap-4">
					{#each stack as tech (tech.name)}
						<HoverCard.Root>
							<HoverCard.Trigger class="block">
								<div
									class="flex h-full w-full items-center gap-4 rounded-lg border border-slate-800 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
								>
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-800 bg-background"
									>
										<tech.icon class="size-5 text-muted-foreground" />
									</div>
									<div class="text-left">
										<div class="truncate text-sm font-bold">{tech.name}</div>
										<div
											class="truncate text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
										>
											{tech.label}
										</div>
									</div>
								</div>
							</HoverCard.Trigger>
							<HoverCard.Content class="w-64 border-slate-800 bg-card/95 backdrop-blur-md">
								<div class="flex flex-col gap-2">
									<div class="flex items-center gap-2">
										<tech.icon class="size-4 text-primary" />
										<span class="text-sm font-bold tracking-tight">{tech.name}</span>
									</div>
									<p class="text-xs leading-relaxed text-muted-foreground">
										{tech.details}
									</p>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					{/each}
				</div>

				<div
					class="mt-8 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4"
				>
					<div class="flex items-center gap-2">
						<Github class="size-4 text-primary" />
						<span class="text-xs font-medium tracking-tight uppercase">Open Source Core</span>
					</div>
					<a
						href="https://github.com/Michael-Obele/shipyard"
						class="text-xs font-bold text-primary hover:underline">View Blueprint</a
					>
				</div>
			</div>
		</section>
	</div>

	<!-- Footer / Author -->
	<section class="mt-32 text-center" in:fade={{ delay: 800 }}>
		<Separator class="mb-12 bg-slate-800" />
		<div class="flex flex-col items-center gap-4">
			<div class="relative">
				<Avatar.Root class="h-16 w-16 border-2 border-primary/20">
					<Avatar.Image
						src="https://avatars.githubusercontent.com/u/70345027?s=48&v=4"
						alt="Michael Obele"
					/>
					<Avatar.Fallback>MO</Avatar.Fallback>
				</Avatar.Root>
				<div
					class="absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-background bg-emerald-500"
				></div>
			</div>
			<div>
				<h3 class="font-bold">Michael Obele</h3>
				<p class="text-sm text-muted-foreground">Mechanical Artisan & Software Engineer</p>
			</div>
			<div class="flex gap-4">
				<a
					href="https://github.com"
					class="text-muted-foreground transition-colors hover:text-primary"
				>
					<Github class="size-5" />
				</a>
				<a
					href="https://twitter.com"
					class="text-muted-foreground transition-colors hover:text-primary"
				>
					<Globe class="size-5" />
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	:global(.project-card:hover) {
		background: radial-gradient(circle at top left, hsla(var(--primary) / 0.15), transparent 70%);
	}
</style>

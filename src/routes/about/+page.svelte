<script lang="ts">
	import {
		Anchor,
		Zap,
		Github,
		Brain,
		Network,
		Activity,
		CircuitBoard,
		Server,
		ListFilter,
		Signal,
		Focus,
		Shield,
		Code,
		Database,
		Command,
		Palette
	} from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { fade, fly } from 'svelte/transition';

	const evolution = [
		{
			year: 'The Problem',
			title: 'Distributed Noise',
			description:
				'I had projects scattered across GitHub, dispersed local folders, and forgotten branches. As a Network Developer, I know that you cannot manage what you cannot see. 30+ repositories meant zero visibility.',
			evidence: ['Fragmented Repos', 'Lost Concepts', 'No central status'],
			icon: ListFilter
		},
		{
			year: 'The Need',
			title: 'Status & Signal',
			description:
				'I needed a way to instantly see what is new, what is trending, and what is core infrastructure. I needed a dashboard, not just a list.',
			evidence: ['Status Tracking', 'Trend Monitoring', 'Freshness'],
			icon: Activity
		},
		{
			year: 'The Solution',
			title: 'Shipyard Registry',
			description:
				'Shipyard is the solution. A single, unified surface where every project is indexed, tracked, and showcased. It is the control plane for my engineering output.',
			evidence: ['Unified Feed', 'Visual Status', 'Central Control'],
			icon: Anchor
		}
	];

	const pillars = [
		{
			title: 'Total Visibility',
			description:
				'The primary goal involves putting all projects in one place. If it exists, it must be indexed here. No hidden work.',
			icon: Focus,
			color: 'text-primary'
		},
		{
			title: 'Network Logic',
			description:
				'I am still a Network Developer at heart. I view this registry as a network map—monitoring the health, status, and connectivity of my work.',
			icon: Network,
			color: 'text-blue-500'
		},
		{
			title: 'Trend Awareness',
			description:
				'Knowing what is "trending" or "new" is vital for prioritization. Shipyard highlights momentum so I know where to focus resources.',
			icon: Signal,
			color: 'text-amber-500'
		},
		{
			title: 'Structural Sincerity',
			description:
				"We don't hide the mechanics. We celebrate the grid and the data. Honesty in every pixel, just like a well-structured packet.",
			icon: CircuitBoard,
			color: 'text-emerald-500'
		}
	];

	const blueprint = [
		{
			name: 'Svelte 5',
			icon: Zap,
			label: 'Native Reactivity',
			description:
				'The core of my UI strategy. Runes provide the granular control needed for artisan interfaces.'
		},
		{
			name: 'Bun',
			icon: Command,
			label: 'Modern Runtime',
			description:
				'The mechanical engine for package management and script execution. Speed that matters.'
		},
		{
			name: 'Tailwind 4',
			icon: Palette,
			label: 'CSS Engine',
			description: 'Utility-first styling with zero-runtime overhead. Pure mechanical efficiency.'
		},
		{
			name: 'Valibot',
			icon: Shield,
			label: 'Type Safety',
			description: 'Schema-driven validation for agentic and human workloads alike.'
		}
	];

	const arsenal = [
		{
			name: 'Svelte 5',
			icon: Zap,
			label: 'UI Framework',
			description:
				'Core reactive framework powering Shipyard and Cinder frontend with modern Runes.'
		},
		{
			name: 'TypeScript',
			icon: Code,
			label: 'Type Safety',
			description: 'Type-safe development for MCP servers, APIs, and scalable applications.'
		},
		{
			name: 'Bun',
			icon: Command,
			label: 'Modern Runtime',
			description: 'Fast JavaScript runtime and package manager for development workflows.'
		},
		{
			name: 'Tailwind CSS',
			icon: Palette,
			label: 'CSS Engine',
			description: 'Utility-first styling for rapid, consistent UI development.'
		},
		{
			name: 'Go',
			icon: Server,
			label: 'Concurrency',
			description: "High-performance backend for Cinder's scraping and API services."
		},
		{
			name: 'Rust',
			icon: CircuitBoard,
			label: 'Systems Performance',
			description: 'Low-level performance and safety for Tauri apps and critical blocks.'
		},
		{
			name: 'PostgreSQL',
			icon: Database,
			label: 'Data Storage',
			description: 'Relational database for persistent metadata and long-term memory.'
		},
		{
			name: 'MCP (TypeScript)',
			icon: Network,
			label: 'Agentic Protocol',
			description: 'Model Context Protocol for AI tool integration and documentation access.'
		}
	];
</script>

<svelte:head>
	<title>About | Shipyard</title>
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-24">
	<!-- Hero Section -->
	<section class="mb-32 text-center" in:fade={{ duration: 800 }}>
		<Badge
			variant="outline"
			class="mb-6 border-primary/20 bg-primary/5 px-4 py-1.5 text-sm tracking-widest text-primary uppercase"
			>The Engineering Registry</Badge
		>
		<h1 class="mb-8 text-5xl font-black tracking-tighter text-balance md:text-8xl">
			THE CENTRAL <br class="hidden md:block" />
			<span class="bg-linear-to-r from-primary to-indigo-400 bg-clip-text text-transparent"
				>REGISTRY</span
			>
		</h1>
		<p class="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
			My main goal is simple: <strong>put all my projects in one place.</strong>
			Shipyard is the unified dashboard where I can see, showcase, and track my engineering output—instantly
			knowing what is new, what is trending, and what matters.
		</p>
	</section>

	<!-- The Signal Narrative -->
	<section class="mb-32" in:fly={{ y: 20, delay: 200, duration: 800 }}>
		<div
			class="rounded-2xl border border-border bg-linear-to-b from-card/50 to-card p-1 backdrop-blur-xl"
		>
			<div
				class="grid items-center gap-12 rounded-xl border border-border/50 bg-background/50 p-8 md:grid-cols-2 md:p-12"
			>
				<div class="space-y-6">
					<div class="flex items-center gap-3 text-indigo-400">
						<Network class="size-6" />
						<h2 class="text-2xl font-bold tracking-tight">The Network Dev POV</h2>
					</div>
					<h3 class="text-4xl font-black tracking-tighter">
						From Network Map <br /><span class="text-muted-foreground">To Project Dashboard</span>
					</h3>
					<div class="space-y-4 leading-relaxed text-muted-foreground">
						<p>
							I am still a <strong>Network Developer</strong>. In my trade, if you can't monitor a
							node, you can't manage it. I realized I was flying blind with my own software
							projects—scattered across repos, hidden in folders.
						</p>
						<p>
							Shipyard applies that same network monitoring philosophy to my codebase. It is
							designed to answer simple but critical questions: <em
								>"What is active? What is trending? Where should I focus next?"</em
							>
						</p>
					</div>
					<div class="flex items-center gap-4 pt-4">
						<div class="h-12 w-1 rounded-full bg-primary/50"></div>
						<p class="text-sm font-medium text-muted-foreground italic">
							"It's about visibility. Seeing the entire network of my work in <span
								class="text-foreground">one single view</span
							>."
						</p>
					</div>
				</div>

				<!-- Visual Representation of Signal -->
				<div
					class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background/50 md:aspect-video"
				>
					<!-- Abstract "Waves" -->
					<div
						class="absolute inset-0 flex items-center justify-center p-6 opacity-30 transition-opacity duration-700 group-hover:opacity-20"
					>
						<div class="flex h-32 items-end gap-1">
							{#each Array(24) as _, i}
								<div
									class="w-1 rounded-full bg-border"
									style="height: {Math.sin(i * 0.5) * 40 + 60}%"
								></div>
							{/each}
						</div>
					</div>

					<!-- Signal Overlay -->
					<div class="absolute inset-0 flex flex-col items-center justify-center">
						<div
							class="w-56 space-y-4 rounded-lg border border-border bg-background/90 p-6 shadow-2xl backdrop-blur-xl"
						>
							<div class="flex items-center justify-between border-b border-border pb-3">
								<div class="flex items-center gap-2">
									<Signal class="size-3 animate-pulse text-primary" />
									<span class="font-mono text-[10px] text-muted-foreground uppercase"
										>High Signal</span
									>
								</div>
								<span class="font-mono text-[9px] text-muted-foreground/60">Curated</span>
							</div>
							<div class="space-y-2">
								<div class="h-1 w-full rounded-full bg-primary/40"></div>
								<div class="h-1 w-3/4 rounded-full bg-border"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- The Signal Evolution -->
	<section class="mb-32">
		<div class="mb-12 flex items-end justify-between">
			<div class="max-w-xl">
				<h2 class="text-3xl font-black tracking-tighter uppercase md:text-5xl">
					THE SIGNAL <span class="text-muted-foreground">EVOLUTION</span>
				</h2>
				<p class="mt-4 text-muted-foreground">
					A mechanical breakdown of my shift from volume to focused engineering signals.
				</p>
			</div>
			<div class="hidden text-right font-mono text-xs text-muted-foreground md:block">
				SYSTEM_STATUS: ONLINE <br />
				MONITORING: ACTIVE
			</div>
		</div>

		<div class="mx-auto max-w-4xl">
			<Accordion.Root type="single" value="step-1" class="w-full">
				{#each evolution as step, i}
					<Accordion.Item
						value="step-{i + 1}"
						class="mb-4 rounded-xl border border-border bg-card/30 backdrop-blur-sm transition-all hover:bg-card/50"
					>
						<Accordion.Trigger class="px-6 py-8 hover:no-underline">
							<div class="flex items-center gap-6 text-left">
								<div
									class="flex size-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary"
								>
									<svelte:component this={step.icon} class="size-6" />
								</div>
								<div>
									<div class="font-mono text-[10px] tracking-widest text-primary uppercase">
										{step.year} // 0{i + 1}
									</div>
									<h3 class="text-2xl font-bold tracking-tight">{step.title}</h3>
								</div>
							</div>
						</Accordion.Trigger>
						<Accordion.Content class="px-6 pb-8">
							<div class="pl-0 md:pl-18">
								<p class="mb-8 text-lg leading-relaxed text-muted-foreground">
									{step.description}
								</p>

								<div class="grid gap-4 md:grid-cols-2">
									{#each step.evidence as item}
										<div
											class="group flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/40 p-4 transition-colors hover:border-primary/30"
										>
											<div
												class="flex h-6 w-1 shrink-0 rounded-full bg-border transition-colors group-hover:bg-primary/50"
											></div>
											<span
												class="text-sm font-medium text-muted-foreground group-hover:text-foreground"
											>
												{item}
											</span>
										</div>
									{/each}
								</div>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	</section>

	<!-- Core Philosophy Bento -->
	<section class="mb-32">
		<div class="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
			<h2 class="text-3xl font-black tracking-tighter uppercase md:text-5xl">
				CORE <span class="text-muted-foreground">PHILOSOPHY</span>
			</h2>
			<div class="h-px flex-1 bg-border md:mx-8"></div>
			<p class="max-w-xs text-right text-sm text-muted-foreground">
				Adhering to the pillars of the Mechanical Artisan.
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
			<!-- Main Feature (Large) -->
			<div
				class="group relative col-span-2 row-span-2 overflow-hidden rounded-xl border border-border bg-linear-to-b from-card to-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50"
			>
				<div
					class="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-20"
				>
					<svelte:component this={pillars[0].icon} size={200} />
				</div>
				<div class="relative z-10 flex h-full flex-col justify-end">
					<div
						class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
					>
						<svelte:component this={pillars[0].icon} class="size-6" />
					</div>
					<h3 class="mb-2 text-3xl leading-none font-black tracking-tighter uppercase">
						{#if pillars[0].title.includes(':')}
							{pillars[0].title.split(':')[0]}<br />
							<span class="text-muted-foreground">{pillars[0].title.split(':')[1]}</span>
						{:else}
							{pillars[0].title}
						{/if}
					</h3>
					<p class="text-lg leading-relaxed text-muted-foreground">
						{pillars[0].description}
					</p>
				</div>
			</div>

			<!-- Secondary Features -->
			{#each pillars.slice(1) as item (item.title)}
				<div
					class="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card md:col-span-1 md:row-span-1"
				>
					<div class="mb-4 flex items-center justify-between">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary transition-colors group-hover:border-primary/50"
						>
							<svelte:component this={item.icon} class="size-5 {item.color}" />
						</div>
					</div>
					<h3 class="text-lg font-bold tracking-tight">{item.title}</h3>
					<p class="mt-2 text-xs leading-relaxed text-muted-foreground">
						{item.description}
					</p>
				</div>
			{/each}

			<!-- Filler / Decor -->
			<div
				class="flex items-center justify-center rounded-xl border border-dashed border-border bg-transparent p-6 opacity-30"
			>
				<div class="text-center">
					<div class="mx-auto mb-2 flex justify-center gap-1">
						{#each Array(3) as _}
							<div class="size-1 rounded-full bg-muted-foreground/30"></div>
						{/each}
					</div>
					<span class="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase"
						>Registry Online</span
					>
				</div>
			</div>
		</div>
	</section>

	<!-- Registry Construction & Technical Arsenal -->
	<section class="mb-32">
		<Tabs.Root value="blueprint" class="w-full">
			<div class="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
				<div class="max-w-md">
					<h2 class="text-3xl font-black tracking-tighter uppercase md:text-5xl">
						TECHNICAL <span class="text-muted-foreground">STACK</span>
					</h2>
					<p class="mt-4 text-sm text-muted-foreground">
						A bifurcation of my technical environment: the blueprint of this registry and my general
						arsenal of engineering tools.
					</p>
				</div>
				<Tabs.List class="grid w-full grid-cols-2 bg-secondary/50 p-1 md:w-auto">
					<Tabs.Trigger
						value="blueprint"
						class="px-8 py-2 font-mono text-[10px] tracking-widest uppercase"
					>
						Shipyard Blueprint
					</Tabs.Trigger>
					<Tabs.Trigger
						value="arsenal"
						class="px-8 py-2 font-mono text-[10px] tracking-widest uppercase"
					>
						Artisan Arsenal
					</Tabs.Trigger>
				</Tabs.List>
			</div>

			<Tabs.Content value="blueprint">
				{#key 'blueprint'}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" in:fade>
						{#each blueprint as tech (tech.name)}
							<HoverCard.Root>
								<HoverCard.Trigger class="block">
									<div
										class="group flex h-full flex-col gap-4 rounded-lg border border-border bg-secondary/10 p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary/30 hover:bg-secondary/20"
									>
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-background shadow-inner transition-colors group-hover:border-primary/50"
										>
											<tech.icon class="size-5 text-foreground" />
										</div>
										<div>
											<div class="text-lg font-bold tracking-tight">{tech.name}</div>
											<div
												class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
											>
												{tech.label}
											</div>
										</div>
									</div>
								</HoverCard.Trigger>
								<HoverCard.Content class="w-64 border-border bg-card/95 backdrop-blur-md">
									<div class="flex flex-col gap-2">
										<div class="flex items-center gap-2">
											<tech.icon class="size-4 text-primary" />
											<span class="text-sm font-bold tracking-tight">{tech.name}</span>
										</div>
										<Separator class="bg-border/50" />
										<p class="text-xs leading-relaxed text-muted-foreground">
											{tech.description}
										</p>
									</div>
								</HoverCard.Content>
							</HoverCard.Root>
						{/each}
					</div>
				{/key}
			</Tabs.Content>

			<Tabs.Content value="arsenal">
				{#key 'arsenal'}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" in:fade>
						{#each arsenal as tech (tech.name)}
							<HoverCard.Root>
								<HoverCard.Trigger class="block">
									<div
										class="group flex h-full flex-col gap-4 rounded-lg border border-border bg-primary/5 p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/10"
									>
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-background shadow-inner transition-colors group-hover:border-primary/50"
										>
											<tech.icon class="size-5 text-foreground" />
										</div>
										<div>
											<div class="text-lg font-bold tracking-tight">{tech.name}</div>
											<div
												class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
											>
												{tech.label}
											</div>
										</div>
									</div>
								</HoverCard.Trigger>
								<HoverCard.Content class="w-64 border-border bg-card/95 backdrop-blur-md">
									<div class="flex flex-col gap-2">
										<div class="flex items-center gap-2">
											<tech.icon class="size-4 text-primary" />
											<span class="text-sm font-bold tracking-tight">{tech.name}</span>
										</div>
										<Separator class="bg-border/50" />
										<p class="text-xs leading-relaxed text-muted-foreground">
											{tech.description}
										</p>
									</div>
								</HoverCard.Content>
							</HoverCard.Root>
						{/each}
					</div>
				{/key}
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<!-- Technical Exchange / Footer -->
	<section class="mt-32 border-t border-border pt-32 pb-16">
		<div class="flex flex-col items-center gap-6 text-center">
			<div class="group relative cursor-pointer">
				<Avatar.Root
					class="h-20 w-20 border-2 border-border transition-all group-hover:scale-105 group-hover:border-primary"
				>
					<Avatar.Image
						src="https://avatars.githubusercontent.com/u/70345027?v=4"
						alt="Michael Obele"
					/>
					<Avatar.Fallback>MO</Avatar.Fallback>
				</Avatar.Root>
				<div
					class="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-emerald-500 shadow-lg shadow-emerald-500/20"
				>
					<div class="h-2 w-2 animate-pulse rounded-full bg-white"></div>
				</div>
			</div>

			<div>
				<h3 class="text-xl font-bold tracking-tight">Michael Obele</h3>
				<p class="mt-1 font-mono text-sm tracking-widest text-muted-foreground uppercase">
					Network Developer // System Architect
				</p>
			</div>

			<p class="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
				Shipyard is a living inventory of my technical workshop. If you're interested in the systems
				behind the projects, I'm always open to a technical exchange.
			</p>

			<div class="mt-6 flex gap-4">
				<a
					href="https://github.com/Michael-Obele/"
					class={buttonVariants({ variant: 'outline', class: 'gap-2 border-border' })}
				>
					<Github class="size-4" />
					Source
				</a>
				<a
					href="mailto:michael@svelte-apps.me"
					class={buttonVariants({ variant: 'default', class: 'gap-2' })}
				>
					<Network class="size-4" />
					Connect
				</a>
			</div>

			<div class="mt-20 font-mono text-[9px] tracking-[0.5em] text-muted-foreground/30 uppercase">
				Established MMXXIV // michael obele // shipyard
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(
			circle at 50% 0%,
			color-mix(in srgb, var(--primary) 5%, transparent),
			transparent 40%
		);
		background-attachment: fixed;
	}
</style>

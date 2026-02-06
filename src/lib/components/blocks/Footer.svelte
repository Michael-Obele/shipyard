<script lang="ts">
	import {
		Github,
		Twitter,
		Anchor,
		Cpu,
		Shield,
		Globe,
		Terminal,
		Activity,
		Hash,
		Layers
	} from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as HoverCard from '$lib/components/ui/hover-card';
</script>

<footer class="mt-24 border-t border-slate-800 bg-card/30 py-16 backdrop-blur-md">
	<div class="container mx-auto max-w-7xl px-4">
		<!-- Footer Content -->
		<div class="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
			<!-- Brand Section -->
			<div class="space-y-6 md:col-span-2 lg:col-span-2">
				<div class="flex items-center gap-2">
					<div
						class="flex size-10 items-center justify-center rounded-lg border border-slate-800 bg-primary/10"
					>
						<Anchor class="size-6 text-primary" />
					</div>
					<h3 class="text-2xl font-bold tracking-tighter text-primary">SHIPYARD</h3>
				</div>
				<p class="max-w-xs text-sm leading-relaxed text-muted-foreground">
					The mechanical artisan engineering registry. A unified ecosystem for high-performance
					project showcasing and technical x-ray analysis.
				</p>
				<div class="flex gap-4">
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						class="flex size-10 items-center justify-center rounded-md border border-slate-800 bg-secondary/50 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
						aria-label="GitHub"
					>
						<Github class="size-5" />
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noreferrer"
						class="flex size-10 items-center justify-center rounded-md border border-slate-800 bg-secondary/50 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
						aria-label="Twitter"
					>
						<Twitter class="size-5" />
					</a>
				</div>
			</div>

			<!-- Registry -->
			<div class="space-y-4">
				<h4
					class="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase"
				>
					<Cpu class="size-4 text-primary" />
					Registry
				</h4>
				<nav class="flex flex-col gap-3 text-sm">
					<a href="/" class="text-muted-foreground transition-colors hover:text-primary"
						>All Projects</a
					>
					<a href="/#featured" class="text-muted-foreground transition-colors hover:text-primary"
						>Featured Stacks</a
					>
					<a href="/#clusters" class="text-muted-foreground transition-colors hover:text-primary"
						>Clusters</a
					>
					<a
						href="/#experimental"
						class="text-muted-foreground transition-colors hover:text-primary">Experimental</a
					>
				</nav>
			</div>

			<!-- Platform -->
			<div class="space-y-4">
				<h4
					class="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase"
				>
					<Shield class="size-4 text-primary" />
					Platform
				</h4>
				<nav class="flex flex-col gap-3 text-sm">
					<a href="/#about" class="text-muted-foreground transition-colors hover:text-primary"
						>Architecture</a
					>
					<a href="/#docs" class="text-muted-foreground transition-colors hover:text-primary"
						>Blueprint</a
					>
					<a href="/#legal" class="text-muted-foreground transition-colors hover:text-primary"
						>System Status</a
					>
				</nav>
			</div>

			<!-- Engineering -->
			<div class="space-y-4">
				<h4
					class="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase"
				>
					<Globe class="size-4 text-primary" />
					Network
				</h4>
				<nav class="flex flex-col gap-3 text-sm">
					<a
						href="https://github.com/settings/tokens"
						class="text-muted-foreground transition-colors hover:text-primary">API Console</a
					>
					<a
						href="https://vercel.com"
						class="text-muted-foreground transition-colors hover:text-primary">Deployment</a
					>
					<a
						href="https://lucide.dev"
						class="text-muted-foreground transition-colors hover:text-primary">Icons Library</a
					>
				</nav>
			</div>
		</div>

		<!-- Diagnostic Panel Redesign -->
		<div
			class="mt-20 overflow-hidden rounded-sm border border-slate-800 bg-background/50 font-mono text-[10px] tracking-[0.2em] uppercase"
		>
			<div class="flex flex-wrap items-stretch divide-x divide-slate-800">
				<!-- Terminal Label -->
				<div class="flex items-center gap-3 bg-slate-900/80 px-4 py-3 text-primary">
					<Terminal class="size-3.5" />
					<span class="font-bold">diagnostic_panel</span>
				</div>

				<!-- Version & Build -->
				<div
					class="group relative flex items-center gap-2 px-5 py-3 transition-colors hover:bg-slate-900/40"
				>
					<HoverCard.Root openDelay={100} closeDelay={100}>
						<HoverCard.Trigger class="flex items-center gap-2 outline-none">
							<Hash class="size-3 text-muted-foreground" />
							<span class="text-muted-foreground">ver:</span>
							<span class="text-foreground">1.0.4_stable</span>
						</HoverCard.Trigger>
						<HoverCard.Content class="w-64 border-slate-800 bg-card p-4 backdrop-blur-xl">
							<div class="space-y-3">
								<div
									class="flex items-center gap-2 border-b border-primary/20 pb-2 text-xs font-bold text-primary"
								>
									<Layers class="size-3.5" />
									BUILD_METADATA
								</div>
								<div class="space-y-1.5 text-[10px] leading-relaxed text-muted-foreground">
									<div class="flex justify-between">
										<span>TIMESTAMP:</span>
										<span class="text-foreground">2026-02-06T14:22Z</span>
									</div>
									<div class="flex justify-between">
										<span>COMMIT_HASH:</span>
										<span class="text-foreground">eb0f92d</span>
									</div>
									<div class="flex justify-between">
										<span>ENVIRONMENT:</span>
										<span class="text-foreground">PROD_STABLE</span>
									</div>
								</div>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				</div>

				<!-- Status -->
				<div class="flex items-center gap-4 px-5 py-3">
					<div class="flex items-center gap-2">
						<Activity class="size-3 text-emerald-500" />
						<span class="text-muted-foreground">runtime:</span>
						<span class="flex items-center gap-2 font-bold text-emerald-500">
							online
							<span
								class="inline-block size-1 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
							></span>
						</span>
					</div>
				</div>

				<!-- Compute -->
				<div class="hidden items-center gap-2 px-5 py-3 md:flex">
					<Cpu class="size-3 text-muted-foreground" />
					<span class="text-muted-foreground">node:</span>
					<span class="text-foreground">edge_worker_01</span>
				</div>

				<!-- Copyright (Auto margins) -->
				<div class="ml-auto flex items-center px-6 py-3 text-[9px] text-muted-foreground/60">
					<span>&copy; shipyard_eng_{new Date().getFullYear()}</span>
				</div>
			</div>

			<!-- Machined Bottom Bar Effect -->
			<div class="h-1 w-full bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
		</div>
	</div>
</footer>

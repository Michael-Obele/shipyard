<script lang="ts">
	import { Github, Twitter, Anchor, FileText, Radar, Radio } from 'lucide-svelte';
</script>

<footer class="mt-24 border-t border-border bg-background/80 py-16 backdrop-blur-xl">
	<div class="container mx-auto max-w-7xl px-4">
		<!-- Footer Content -->
		<div class="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
			<!-- Brand Section -->
			<div class="space-y-6 md:col-span-2 lg:col-span-2">
				<div class="flex items-center gap-3">
					<div
						class="flex size-10 items-center justify-center rounded-lg border border-border bg-card shadow-[0_0_15px_rgba(var(--primary),0.1)]"
					>
						<Anchor class="size-5 text-primary" />
					</div>
					<div>
						<h3 class="font-mono text-lg font-bold tracking-tighter text-foreground">SHIPYARD</h3>
						<div
							class="flex items-center gap-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase"
						>
							<span>Naval Registry</span>
							<span class="size-1 rounded-full bg-primary"></span>
							<span>MCC-v2.0</span>
						</div>
					</div>
				</div>
				<p class="max-w-xs text-sm leading-relaxed text-muted-foreground">
					The mechanical artisan engineering registry. A unified dry dock for high-performance
					vessels and technical x-ray analysis.
				</p>
				<div class="flex gap-3">
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						class="group flex size-9 items-center justify-center rounded-md border border-border bg-secondary/50 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
						aria-label="GitHub"
					>
						<Github class="size-4 transition-transform group-hover:scale-110" />
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noreferrer"
						class="group flex size-9 items-center justify-center rounded-md border border-border bg-secondary/50 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
						aria-label="Twitter"
					>
						<Twitter class="size-4 transition-transform group-hover:scale-110" />
					</a>
				</div>
			</div>

			<!-- Manifest (Registry) -->
			<div class="cursor-default space-y-6">
				<h4
					class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-foreground uppercase"
				>
					<FileText class="size-3.5 text-primary" />
					MANIFEST
				</h4>
				<nav class="flex flex-col gap-3 text-sm">
					<a
						href="/"
						class="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<span class="h-px w-0 bg-primary transition-all group-hover:w-2"></span>
						All Vessels
					</a>
					<a
						href="/#featured"
						class="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<span class="h-px w-0 bg-primary transition-all group-hover:w-2"></span>
						Flagships
					</a>
					<a
						href="/#clusters"
						class="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<span class="h-px w-0 bg-primary transition-all group-hover:w-2"></span>
						Active Fleets
					</a>
					<a
						href="/#experimental"
						class="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<span class="h-px w-0 bg-primary transition-all group-hover:w-2"></span>
						Dry Dock
					</a>
				</nav>
			</div>

			<!-- Comms (Social) -->
			<div class="cursor-default space-y-6">
				<h4
					class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-foreground uppercase"
				>
					<Radio class="size-3.5 text-primary" />
					COMMS
				</h4>
				<nav class="flex flex-col gap-3 text-sm">
					<a
						href="https://github.com/Michael-Obele"
						target="_blank"
						rel="noreferrer"
						class="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<span class="h-px w-0 bg-primary transition-all group-hover:w-2"></span>
						Transmission
					</a>
					<a
						href="mailto:contact@shipyard.registry"
						class="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<span class="h-px w-0 bg-primary transition-all group-hover:w-2"></span>
						Signal
					</a>
				</nav>
			</div>

			<!-- Status (Meta) -->
			<div class="cursor-default space-y-6">
				<h4
					class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-foreground uppercase"
				>
					<Radar class="size-3.5 text-primary" />
					COORDINATES
				</h4>
				<div class="space-y-4 text-sm text-muted-foreground">
					<div class="flex items-center justify-between border-b border-border pb-2">
						<span>Systems</span>
						<span class="font-mono text-primary">ONLINE</span>
					</div>
					<div class="flex items-center justify-between border-b border-border pb-2">
						<span>Registry</span>
						<span class="font-mono text-foreground uppercase">ACTIVE</span>
					</div>
					<p class="pt-2 text-[10px] leading-relaxed uppercase opacity-60">
						&copy; {new Date().getFullYear()} Shipyard. <br />
						All rights reserved.
					</p>
				</div>
			</div>
		</div>
	</div>
</footer>

<script lang="ts">
	import { Github } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
</script>

<footer class="mt-16 border-t border-border bg-muted/50 py-12">
	<div class="container mx-auto max-w-7xl px-4">
		<!-- Footer Content -->
		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Brand Section -->
			<div class="space-y-2">
				<h3 class="text-lg font-bold text-primary">Shipyard</h3>
				<p class="text-sm text-muted-foreground">
					A unified, high-performance engineering registry for showcasing your projects.
				</p>
			</div>

			<!-- Quick Links -->
			<div class="space-y-2">
				<h4 class="text-sm font-semibold">Quick Links</h4>
				<nav class="flex flex-col gap-2 text-sm">
					<a href="/" class="text-muted-foreground transition-colors hover:text-primary"> Home </a>
					<a href="#projects" class="text-muted-foreground transition-colors hover:text-primary">
						Projects
					</a>
					<a href="#about" class="text-muted-foreground transition-colors hover:text-primary">
						About
					</a>
				</nav>
			</div>

			<!-- Social Links -->
			<div class="space-y-2">
				<h4 class="text-sm font-semibold">Connect</h4>
				<div class="flex gap-4">
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						class="text-muted-foreground transition-colors hover:text-primary"
						aria-label="GitHub"
					>
						<Github class="size-5" />
					</a>
				</div>
			</div>
		</div>

		<Separator class="my-8" />

		<!-- Copyright -->
		<div class="text-center text-sm text-muted-foreground">
			<p>&copy; {new Date().getFullYear()} Shipyard. All rights reserved.</p>
		</div>
	</div>
</footer>

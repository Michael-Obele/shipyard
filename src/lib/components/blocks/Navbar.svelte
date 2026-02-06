<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Menu, X, Moon, Sun } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';

	let isOpen = $state(false);

	function handleNavClick() {
		isOpen = false;
	}
</script>

<!-- Desktop Navigation -->
<nav
	class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
	<div class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
		<!-- Logo/Brand -->
		<div class="flex items-center gap-2">
			<div class="text-lg font-bold text-primary">Shipyard</div>
		</div>

		<!-- Desktop Links -->
		<div class="hidden gap-8 md:flex">
			<a href="/" class="text-sm font-medium transition-colors hover:text-primary">Home</a>
			<a href="#projects" class="text-sm font-medium transition-colors hover:text-primary"
				>Projects</a
			>
			<a href="#about" class="text-sm font-medium transition-colors hover:text-primary">About</a>
		</div>

		<!-- Theme Toggle & Mobile Menu -->
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleMode} aria-label="Toggle theme">
				<Sun class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Moon
					class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
			</Button>

			<!-- Mobile Menu Sheet -->
			<Sheet.Root bind:open={isOpen}>
				<Sheet.Trigger
					class="hidden h-10 w-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex"
					aria-label="Open menu"
				>
					{#if isOpen}
						<X class="size-5" />
					{:else}
						<Menu class="size-5" />
					{/if}
				</Sheet.Trigger>
				<Sheet.Content side="right">
					<Sheet.Header>
						<Sheet.Title>Navigation</Sheet.Title>
					</Sheet.Header>
					<nav class="mt-8 flex flex-col gap-4">
						<a
							href="/"
							class="text-sm font-medium transition-colors hover:text-primary"
							onclick={handleNavClick}
						>
							Home
						</a>
						<a
							href="#projects"
							class="text-sm font-medium transition-colors hover:text-primary"
							onclick={handleNavClick}
						>
							Projects
						</a>
						<a
							href="#about"
							class="text-sm font-medium transition-colors hover:text-primary"
							onclick={handleNavClick}
						>
							About
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</nav>

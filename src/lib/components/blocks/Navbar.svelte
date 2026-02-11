<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Menu, X, Moon, Sun, Anchor, Github } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
	import { MediaQuery } from 'svelte/reactivity';
	import { page } from '$app/state';

	let isOpen = $state(false);
	const isMobile = new MediaQuery('max-width: 768px');

	$effect(() => {
		if (!isMobile.current && isOpen) {
			isOpen = false;
		}
	});

	function handleNavClick() {
		isOpen = false;
	}

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Projects', href: '/#projects' },
		{ name: 'About', href: '/about' }
	];
</script>

<!-- Desktop Navigation -->
<nav
	class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300 hover:bg-background/90"
	style="--glow: radial-gradient(circle at top left, color-mix(in srgb, var(--primary) 5%, transparent), transparent 70%); background-image: var(--glow);"
>
	<div class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
		<!-- Logo/Brand -->
		<a
			href="/"
			class="group flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
		>
			<div class="relative">
				<Anchor class="size-6 rotate-12 text-primary transition-transform group-hover:rotate-0" />
				<div
					class="absolute inset-0 -z-10 bg-primary/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100"
				></div>
			</div>
			<div class="text-xl font-bold tracking-tighter text-primary">SHIPYARD</div>
		</a>

		<!-- Desktop Links -->
		<div class="hidden items-center gap-1 md:flex">
			{#each links as link}
				<a
					href={link.href}
					class="rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground {page
						.url.pathname === link.href ||
					(link.href.startsWith('/#') && page.url.pathname === '/')
						? 'bg-accent/50 text-primary'
						: ''}">{link.name}</a
				>
			{/each}
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			<a
				href="https://github.com"
				target="_blank"
				rel="noreferrer"
				class="hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary/50 transition-all hover:bg-accent hover:text-accent-foreground sm:flex"
				aria-label="GitHub"
			>
				<Github class="size-5" />
			</a>

			<Button
				variant="ghost"
				size="icon"
				onclick={toggleMode}
				class="border border-transparent hover:border-border"
				aria-label="Toggle theme"
			>
				<Sun class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Moon
					class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
			</Button>

			<!-- Mobile Menu Sheet -->
			{#if isMobile.current}
				<Sheet.Root bind:open={isOpen}>
					<Sheet.Trigger
						class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background transition-all hover:bg-accent hover:text-accent-foreground md:hidden"
						aria-label="Open menu"
					>
						{#if isOpen}
							<X class="size-5" />
						{:else}
							<Menu class="size-5" />
						{/if}
					</Sheet.Trigger>
					<Sheet.Content side="right" class="border-l border-border bg-card/95 backdrop-blur-xl">
						<Sheet.Header class="mb-8">
							<Sheet.Title class="text-left text-2xl font-bold tracking-tighter text-primary"
								>MENU</Sheet.Title
							>
						</Sheet.Header>
						<nav class="flex flex-col gap-2">
							{#each links as link}
								<a
									href={link.href}
									class="flex items-center justify-between rounded-lg border border-transparent p-4 text-lg font-medium transition-all hover:border-border hover:bg-accent {page
										.url.pathname === link.href
										? 'bg-accent/50 text-primary'
										: ''}"
									onclick={handleNavClick}
								>
									{link.name}
								</a>
							{/each}
							<div class="mt-8 flex gap-4 p-4">
								<a
									href="https://github.com"
									target="_blank"
									rel="noreferrer"
									class="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 font-medium transition-all hover:bg-accent"
								>
									<Github class="size-5" />
									GitHub
								</a>
							</div>
						</nav>
					</Sheet.Content>
				</Sheet.Root>
			{/if}
		</div>
	</div>
</nav>

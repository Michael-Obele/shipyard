<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Footer from '$lib/components/blocks/Footer.svelte';
	import { PageLoader } from '$lib/components/ui/page-loader';
	import { ModeWatcher } from 'mode-watcher';
	import { navigating } from '$app/state';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

{#if navigating.to}
	<PageLoader />
{/if}

<Navbar />
<div class=" min-h-screen bg-background">
	<div class="">
		{@render children()}
	</div>
	<Footer />
</div>

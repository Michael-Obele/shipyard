<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import Footer from '$lib/components/blocks/Footer.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<Navbar />
<div class=" min-h-screen bg-background">
	<div class="">
		{@render children()}
	</div>
	<Footer />
</div>

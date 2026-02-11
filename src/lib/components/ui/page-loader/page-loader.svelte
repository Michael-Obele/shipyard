<script lang="ts">
	import { fade } from 'svelte/transition';

	let { visible = true } = $props();
</script>

{#if visible}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm"
	>
		<div
			class="relative flex h-64 w-64 items-center justify-center rounded-3xl border border-slate-800 bg-card/50 shadow-2xl backdrop-blur-md"
		>
			<!-- Subtle glow effect -->
			<div class="absolute inset-0 -z-10 rounded-3xl bg-primary/10 blur-3xl"></div>

			<lord-icon
				src="https://cdn.lordicon.com/ginorzey.json"
				trigger="loop"
				state="loop-cycle"
				style="width:200px;height:200px"
				colors="primary:#6366f1,secondary:#475569"
			>
			</lord-icon>

			<div
				class="absolute bottom-6 font-mono text-xs tracking-widest text-muted-foreground uppercase"
			>
				Initializing Systems
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import { onMount } from 'svelte';

	let {
		src,
		primaryColor = '#d46211',
		secondaryColor = '#475569',
		delay = 0,
		loopAfterIn = true,
		size = 50,
		height,
		// New props from Lordicon documentation
		colors,
		stroke,
		speed,
		trigger,
		animationState,
		target,
		loading,
		triggerChangeDelay = 0
	} = $props<{
		src: string;
		primaryColor?: string;
		secondaryColor?: string;
		delay?: number;
		loopAfterIn?: boolean;
		size?: number;
		height?: number;
		// New props from Lordicon documentation
		colors?: string;
		stroke?: 'light' | 'regular' | 'bold';
		speed?: number;
		trigger?:
			| 'in'
			| 'click'
			| 'hover'
			| 'loop'
			| 'loop-on-hover'
			| 'morph'
			| 'boomerang'
			| 'sequence';
		animationState?: string;
		target?: string;
		loading?: 'lazy' | 'interaction' | 'delay';
		triggerChangeDelay?: number;
		others?: any;
	}>();

	// Build colors string from primaryColor/secondaryColor if colors prop not provided
	let colorsValue = $derived(colors || `primary:${primaryColor},secondary:${secondaryColor}`);

	// Determine initial trigger value
	// If loopAfterIn is true, start with "in", otherwise use trigger or "in"
	let triggerValue = $derived(loopAfterIn ? 'in-reveal' : trigger || 'in');

	// Build attributes object for custom props
	let customAttributes = $derived({
		...(stroke && { stroke }),
		...(speed && { speed }),
		...(animationState && { state: animationState }),
		...(target && { target }),
		...(loading && { loading })
	});

	let element: HTMLElement | undefined;

	// Handle trigger change after mounting if loopAfterIn is true
	onMount(() => {
		if (loopAfterIn) {
			const finalTrigger = trigger || 'loop';
			if (triggerChangeDelay > 0) {
				setTimeout(() => {
					triggerValue = finalTrigger;
				}, triggerChangeDelay);
			} else {
				triggerValue = finalTrigger;
			}
		}
	});
</script>

<lord-icon
	bind:this={element}
	{src}
	trigger={triggerValue}
	colors={colorsValue}
	style="width: {size}px; height: {height ?? size}px;"
	{...customAttributes}
></lord-icon>

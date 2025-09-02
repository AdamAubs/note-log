<script>
	import { onMount } from 'svelte';
	import katex from 'katex';

	export let formula;
	export let block = false;

	let element;

	onMount(() => {
		if (element) {
			katex.render(formula, element, {
				displayMode: block,
				throwOnError: false
			});
		}
	});
</script>

<span bind:this={element}></span>
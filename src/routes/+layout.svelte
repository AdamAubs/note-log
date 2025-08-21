<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="https://fav.farm/%F0%9F%93%96" />
</svelte:head>

<Header />

{@render children?.()}

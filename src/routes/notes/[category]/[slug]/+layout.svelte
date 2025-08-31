<script lang="ts">
	import SidebarTree from '$lib/components/SidebarTree.svelte';
	import { notesFileTree } from '$lib/treeDataStructures/notesFileTree';

	let { children } = $props();
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
	/>
</svelte:head>

<div class="flex">
	<div class="hidden max-w-[16rem] min-w-[16rem] sm:block">
		<SidebarTree tree={notesFileTree} isRoot={true} />
	</div>

	<div class="container mx-auto min-h-[70vh] w-full max-w-3xl p-6">
		{@render children?.()}
	</div>
</div>

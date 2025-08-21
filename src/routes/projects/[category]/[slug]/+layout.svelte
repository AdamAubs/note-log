<script lang="ts">
	import SidebarTree from '$lib/components/SidebarTree.svelte';
	import { projectFileTree } from '$lib/treeDataStructures/projectFileTree';

	let { children } = $props();
</script>

<svelte:head>
	<!-- You can add your font import here if needed -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
	/>
</svelte:head>

<div class="flex">
	<div class="hidden max-w-[16rem] min-w-[16rem] sm:block">
		<SidebarTree tree={projectFileTree} isRoot={true} />
	</div>
</div>



<div class="container mx-auto min-h-[70vh] w-full max-w-3xl p-6">
	{@render children?.()}
</div>

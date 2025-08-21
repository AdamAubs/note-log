<script lang="ts">
	let { tree, isRoot = false } = $props();
	import SidebarTree from '$lib/components/SidebarTree.svelte';

	// Helper to check if the current node is the last file in the array
	function isLastFile(
		tree: Array<{ type: string; name: string; path?: string; children?: any }>,
		idx: number
	) {
		for (let j = idx + 1; j < tree.length; j++) {
			if (tree[j].type === 'file') return false;
		}
		return tree[idx].type === 'file';
	}
</script>

<ul class="font-mono">
	{#if isRoot}
		<li>
			<span>├─ </span>
			<a href="/" class="font-medium underline hover:text-orange-500">Home</a>
		</li>
	{/if}
	{#each tree as node, i}
		<li>
			{#if node.type === 'file'}
				<span>{isLastFile(tree, i) ? '└── ' : '├── '}</span>
				<a
					href={node.path}
					class="inline-block max-w-[12rem] truncate overflow-hidden align-middle whitespace-nowrap underline hover:text-orange-500"
				>
					{node.name}
				</a>
			{:else}
				<span>{'├── '} </span><span class="font-bold text-orange-500">{node.name}</span>
				{#if node.children}
					<SidebarTree tree={node.children} />
				{/if}
			{/if}
		</li>
	{/each}
</ul>

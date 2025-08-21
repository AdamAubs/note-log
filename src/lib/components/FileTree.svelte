<script lang="ts">
	import { base } from '$app/paths';
	let { tree, prefix } = $props();
	import FileTree from '$lib/components/FileTree.svelte';

	function isExternal(path: string) {
		return /^https?:\/\//.test(path);
	}
</script>

<ul class="font-mono">
	{#each tree as node, i}
		<li>
			<span>
				{#each prefix as p}
					{p}
				{/each}
				{i === tree.length - 1 ? '└── ' : '├── '}
			</span>
			{#if node.type === 'folder'}
				<span class="font-bold text-orange-500">{node.name}</span>
				{#if node.children}
					<FileTree
						tree={node.children}
						prefix={[
							...prefix,
							i === tree.length - 1
								? prefix.length === 0
									? '\u00A0\u00A0\u00A0'
									: '\u00A0\u00A0\u00A0\u00A0'
								: prefix.length === 0
									? '|\u00A0\u00A0'
									: '\u00A0|\u00A0\u00A0'
						]}
					/>
				{/if}
			{:else}
				<a
					href={isExternal(node.path) ? node.path : `${base}${node.path}`}
					class="underline hover:text-orange-500"
					target={isExternal(node.path) ? '_blank' : undefined}
					rel={isExternal(node.path) ? 'noopener noreferrer' : undefined}
				>
					{node.name}
				</a>
			{/if}
		</li>
	{/each}
</ul>

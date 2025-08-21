<script lang="ts">
	import FileTree from '$lib/components/FileTree.svelte';
	import { projectFileTree } from '$lib/treeDataStructures/projectFileTree';
	import { socialPlatformTree } from '$lib/treeDataStructures/socialPlatformTree';
	import { notesFileTree } from '$lib/treeDataStructures/notesFileTree';
	import { currentTheme } from '$lib/stores/currentTheme';
</script>

<div
	class="flex min-h-screen flex-col items-center justify-start font-inter"
	data-theme={$currentTheme}
>
	<!-- Top section -->
	<section class="mx-auto flex w-full flex-col items-center py-4">
		<div class="mb-8 flex w-full flex-col items-center gap-3">
			<h1 class="text-center text-4xl font-extrabold drop-shadow-sm">Hi, I'm Adam 👋</h1>
			<p class="mb-2 text-center text-lg font-medium text-gray-600 dark:text-gray-100">
				Here are some trees that I have been trying to grow
			</p>
		</div>
		<div class="flex flex-col">
			<h2 class="mb-3 border-b border-gray-300 pb-1 text-center text-2xl font-bold">
				Social Platforms
			</h2>
			<FileTree tree={socialPlatformTree} prefix={[]} />
		</div>
	</section>

	<!-- Lower section -->
	<section class="grid w-full grid-cols-1 items-center justify-items-center gap-4 md:grid-cols-2">
		<div class="flex flex-col justify-center">
			<h2 class="mb-3 border-b border-gray-300 pb-1 text-center text-2xl font-bold">Projects</h2>
			<FileTree tree={projectFileTree} prefix={[]} />
		</div>
		<div class="flex flex-col justify-center">
			<h2 class="mb-3 border-b border-gray-300 pb-1 text-center text-2xl font-bold">Notes</h2>
			<FileTree tree={notesFileTree} prefix={[]} />
		</div>
	</section>
</div>

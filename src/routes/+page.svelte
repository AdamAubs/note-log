<script lang="ts">
	import { Hand, Icon } from 'lucide-svelte';
	import FileTree from '$lib/components/FileTree.svelte';
	import { fileTreeData } from '$lib/fileTreeData';
</script>

<div class="min-h-screen bg-light font-inter text-dark">
	<section class="mx-auto flex max-w-2xl flex-col items-center py-12">
		<div class="mb-8 flex flex-col items-center gap-4">
			<h1 class="text-3xl font-extrabold">Hi, I'm Adam 👋</h1>
			<p>Here are some trees that I have been trying to grow</p>
		</div>
	</section>
	<p>Project Tree</p>
	<FileTree tree={fileTreeData} prefix={[]} />
</div>

<script lang="ts">
	import { Sun, MoonStar } from 'lucide-svelte';
	import { page } from '$app/stores';

	import { themeChange } from 'theme-change';
	import { currentTheme } from '$lib/stores/currentTheme';
	import { onMount } from 'svelte';

	const toggleTheme = () => {
		if ($currentTheme === 'dracula') {
			$currentTheme = 'cupcake';
		} else if ($currentTheme === 'cupcake') {
			$currentTheme = 'dracula';
		}

		console.log('current theme: ', $currentTheme);
	};

	onMount(() => {
		themeChange(false);
		const savedTheme = localStorage.getItem('theme') as 'cupcake' | 'dracula';
		currentTheme.set(savedTheme || 'cupcake');
	});
</script>

<nav class="flex w-full items-center justify-between p-2">
	{#if $page.url.pathname !== '/'}
		<div class="block sm:hidden">
			<ul class="font-mono">
				<li>
					<span>├─ </span>
					<a href="/" class="font-medium underline hover:text-orange-500">Home</a>
				</li>
			</ul>
		</div>
	{/if}
	<label class="swap swap-rotate" data-toggle-theme="cupcake,dracula">
		<input
			type="checkbox"
			checked={$currentTheme === 'cupcake'}
			onchange={toggleTheme}
			data-toggle-theme="cupcake,dracula"
			class="theme-controller text appearance-none bg-transparent [&::-webkit-checkbox]:hidden"
			style="accent-color:transparent;"
		/>
		<Sun class="swap-on" />
		<MoonStar class="swap-off" />
	</label>
</nav>

export async function load({ params }) {
	const { category, slug } = params;
	// Remove .svx extension if present to prevent double ".svx.svx" imports.
	// The extension must be in the static part of the import for Vite to analyze it.
	const cleanSlug = slug.endsWith('.svx') ? slug.slice(0, -4) : slug;
	const post = await import(`../${category}/${cleanSlug}.svx`);
	const metadata = post.metadata;

	const content = post.default;

	return {
		content,
		metadata
	};
}

export async function load({ params }) {
	const { category, subcategory, slug } = params;
	// Remove .svx extension if present to prevent double ".svx.svx" imports.
	// The extension must be in the static part of the import for Vite to analyze it.
	const cleanSlug = slug.endsWith('.svx') ? slug.slice(0, -4) : slug;

	// Use explicit glob pattern for Vite to analyze - must match all possible .svx files
	const modules = import.meta.glob('../../*/*/*.svx');
	const path = `../../${category}/${subcategory}/${cleanSlug}.svx`;
	const post = await modules[path]();
	const metadata = post.metadata;

	const content = post.default;

	return {
		content,
		metadata
	};
}

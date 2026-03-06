export async function load({ params }) {
	const { category, subcategory, slug } = params;
	// Strip known extensions to get a clean slug
	const cleanSlug = slug.endsWith('.svx')
		? slug.slice(0, -4)
		: slug.endsWith('.md')
			? slug.slice(0, -3)
			: slug;

	// Vite requires the extension to be in the static part of the glob pattern
	const svxModules = import.meta.glob('../../*/*/*.svx');
	const mdModules = import.meta.glob('../../*/*/*.md');

	const svxPath = `../../${category}/${subcategory}/${cleanSlug}.svx`;
	const mdPath = `../../${category}/${subcategory}/${cleanSlug}.md`;

	const loader = svxModules[svxPath] ?? mdModules[mdPath];

	if (!loader) {
		throw new Error(`No note found for path: ${svxPath} or ${mdPath}`);
	}

	const post = await loader();
	const metadata = post.metadata;
	const content = post.default;

	return {
		content,
		metadata
	};
}

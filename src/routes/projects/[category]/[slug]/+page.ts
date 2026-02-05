export async function load({ params }) {
	const { category, slug } = params;
	const filename = slug.endsWith('.svx') ? slug : `${slug}.svx`;
	const post = await import(`../${category}/${filename}`);
	const metadata = post.metadata;

	const content = post.default;

	return {
		content,
		metadata
	};
}

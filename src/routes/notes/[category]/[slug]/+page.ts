export async function load({ params }) {
	const { category, slug } = params;
	const post = await import(`../${category}/${slug}.svx`);
	const metadata = post.metadata;

	const content = post.default;

	return {
		content,
		metadata
	};
}

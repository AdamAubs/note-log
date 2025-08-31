<script>
	let flipped = $state(false);
	let { question, answer, imgPath } = $props();
	console.log(imgPath);
</script>

<div class="container">
	Click on card to revel answer
	<button class={['flash-card', { flipped }]} onclick={() => (flipped = !flipped)}>
		<div class="front">
			<div class="img-question-container">
				<img src={imgPath} alt={question} />
				<p class="question">{question}</p>
			</div>
		</div>
		<div class="back">
			<p class="answer">{answer}</p>
		</div>
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		align-items: center;
		justify-content: center;
		perspective: 100vh;
		font-family: var(--font-inter, 'Inter', ui-sans-serif, system-ui, sans-serif);
	}

	.flash-card {
		position: relative;
		width: 100%;
		height: 400px;
		background: var(--color-light, #eef0f2);
		border-radius: 1.5em;
		border: 2px solid var(--color-orange-500, #ff8800);
		color: var(--color-dark, #1c1c1c);
		transform: rotateY(180deg);
		transition: transform 0.4s;
		transform-style: preserve-3d;
		padding: 0;
		user-select: none;
		cursor: pointer;
	}

	.flash-card.flipped {
		transform: rotateY(0);
	}

	.front,
	.back {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		backface-visibility: hidden;
		border-radius: 2em;
		box-sizing: border-box;
		padding: 2em;
	}

	.back {
		transform: rotateY(0deg);
	}

	.front {
		transform: rotateY(180deg);
	}

	.img-question-container {
		max-width: 60%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: scroll;
	}

	.front img {
		width: 60%;
		object-fit: contain;
		border-radius: 1em;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		margin: 0 auto;
	}

	.question {
		font-weight: 700;
		font-size: 1em;
		letter-spacing: 0.01em;
		color: var(--color-dark, #1c1c1c);
		text-align: center;
		overflow: scroll;
	}

	.answer {
		font-weight: 500;
		font-size: 1.1em;
		color: var(--color-orange-700, #ff6600);
		text-align: center;
		overflow: scroll;
	}
</style>

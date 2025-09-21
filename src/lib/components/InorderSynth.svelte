<script lang="ts">
	import { onMount } from 'svelte';
	import type { Tone } from 'tone/build/esm/core/Tone';
	let synth;

	onMount(() => {
		import('tone').then((Tone) => {
			synth = new Tone.Synth().toDestination();
		});
	});

	function playNote(note: string) {
		if (synth) synth.triggerAttackRelease(`${note}`, '8n');
	}

	function playInorder() {
		const bst = new BST();
		let root = null;

		root = bst.createSampleTree();

		bst.printInorder(root);
	}

	class TreeNode {
		note: string;
		left: TreeNode | null;
		right: TreeNode | null;

		constructor(note: string) {
			this.note = note;
			this.left = null;
			this.right = null;
		}
	}

	class BST {
		root: TreeNode | null;

		constructor() {
			this.root = null;
		}

		insert(root: TreeNode | null, note: string) {
			if (root == null) {
				console.log(`Inserting ${note} into BST`);
				return new TreeNode(note);
			}

			if (note < root.note) {
				root.left = this.insert(root.left, note);
			} else if (note > root.note) {
				root.right = this.insert(root.right, note);
			} else {
				if (root.left == null) {
					root.left = this.insert(root.left, note);
				} else {
					root.right = this.insert(root.right, note);
				}
			}

			return root;
		}

		createSampleTree() {
			let notes = ['C4', 'C2', 'C5', 'C6', 'C7'];

			for (const note of notes) {
				this.root = this.insert(this.root, note);
			}

			return this.root;
		}

		async printInorder(root: TreeNode | null) {
			if (root == null) {
				return;
			}

			await this.printInorder(root.left);
			console.log(root.note);
			if (synth) synth.triggerAttackRelease(root.note, '8n');
			await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
			await this.printInorder(root.right);
		}
	}
</script>

<div>
	<button onclick={playInorder}>Play Inorder</button>
</div>

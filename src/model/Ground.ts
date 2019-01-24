/// <reference path="../_references.ts" />

class Ground extends Entity {
	private static readonly alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split('');
	
	constructor() {
		let randomLetter: string = Ground.alphabet[Math.floor(Math.random() * Ground.alphabet.length)];
		console.log(randomLetter);
		super(randomLetter);
	}
}
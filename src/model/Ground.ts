/// <reference path="../_references.ts" />

class Ground extends Entity {
	//private static readonly alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split('');
	private static readonly alphabet: string[] = "bcdfghjklmnpqrstvwxyz".split('');

	constructor() {
		let randomLetter: string = Ground.alphabet[Math.floor(Math.random() * Ground.alphabet.length)];
		super(randomLetter);
	}

	playerCollision(): void {
		// this.name = " ";
		// let tile = game.tileMap.tiles[this.location[0][0]][this.location[0][1]];
		// tile.changeLetter(tile.letters.length-2, this.name);
	}
}
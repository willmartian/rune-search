/// <reference path="../_references.ts" />

class Ground extends Entity {
	//private static readonly alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split('');
	private static readonly alphabet: string[] = "bcdfghjklmnpqrstvwxyz".split('');
	// private static readonly alphabet: string[] = "^^^".split('');

	private interval: any;

	constructor() {
		let randomLetter: string = Ground.alphabet[Math.floor(Math.random() * Ground.alphabet.length)];
		super(randomLetter);
	}

	playerCollision(): void {
		if (this.name != " ") {
			Game.player.hunger -= 1;
			let tile = game.tileMap.tiles[this.location[0][0]][this.location[0][1]];
			let oldName = this.name;
			this.name = " ";
			tile.changeLetter(tile.letters.length-2, this.name);
		}

		// this.interval = setInterval(this.revert.bind(this, tile, oldName), 10000);
	}

	revert(tile: Tile, oldName: string) {
		this.name = oldName;
		tile.changeLetter(tile.letters.length-1, this.name);
		clearInterval(this.interval);
	}
}
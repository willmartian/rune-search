/// <reference path="../_references.ts" />

class Door extends Entity {
	constructor() {
		super("Door");
	}

	playerCollision(): void {
		for (let item of Game.player.inventory) {
			if (item.name == "Key") {
				Game.player.removeItem(item);
				game.nextLevel();
				super.playerCollision();
			}
		}
	}
}
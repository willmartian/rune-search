/// <reference path="../_references.ts" />

class Shopkeep extends Entity {
	constructor() {
		super("Shopkeep");
	}

	playerCollision(): void {
		// for (let item of Game.player.inventory) {
		// 	if (item.name == "Key") {
		// 		Game.player.removeItem(item);
		// 		game.nextLevel();
		// 		super.playerCollision();
		// 	}
		// }
		super.playerCollision();
	}
}
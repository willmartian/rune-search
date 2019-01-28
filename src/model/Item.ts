/// <reference path="../_references.ts" />

abstract class Item extends Entity {
	constructor(name: string) {
		super(name);
	}

	playerCollision(): void {
		if (!game.player.inventory.includes(this)) {
			game.player.addItem(this);
			console.log(this.name + " added to inventory!");
		}		
	}
}
/// <reference path="../_references.ts" />

abstract class Item extends Entity {
	constructor(name: string) {
		super(name);
	}

	playerCollision(): void {
		if (!Game.player.inventory.includes(this)) {
			Game.player.addItem(this);
			console.log(this.name + " added to inventory!");
		}
		super.playerCollision();
		
	}
}
/// <reference path="../_references.ts" />

abstract class Item extends Entity {
	constructor(name: string) {
		super(name);
	}

	collideWithPlayer(player: Player): void {
		if (!player.inventory.includes(this)) {
			player.addItem(this);
			console.log(this.name + " added to inventory!");
		}		
	}
}
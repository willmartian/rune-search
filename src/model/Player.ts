/// <reference path="../_references.ts" />

class Player extends Character {
	protected _party: Character[];

	constructor(name: string) {
		super(name);
		super._health = 10;
		super._attackDamage = 1;
		super._active = true;
		this._party = [];
	}

	// die(): void {
	// 	this.name = "DEAD";
	// }
	
	playerCollision() {}
}
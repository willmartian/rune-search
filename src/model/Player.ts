/// <reference path="../_references.ts" />

class Player extends Character {
	protected _party: Character[];
	protected _mana: Manager;

	constructor(name: string) {
		super(name);
		super._health = 10;
		super._attackDamage = 1;
		super._active = true;
		this._party = [];
		this._mana = new Manager();
	}
	
	get mana(): Manager {
		return this._mana;
	}

	playerCollision() {}
}
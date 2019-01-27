/// <reference path="../_references.ts" />

abstract class Character extends Entity {
	protected _attackDamage: number;
	protected _health: number;
	protected _inventory: Item[];

	constructor(name: string) {
		super(name);
		this._inventory = [];
	}

	attack(enemy: Character): void {
		enemy._health -= this._attackDamage;
	}

	addItem(item: Item): void {
		this._inventory.push(item);
	}

	collideWithPlayer(player: Player): void {
		while (this._health > 0 && player._health > 0) {
			player.attack(this);
			this.attack(player);
			console.log("enemy battled");
		}
	}

	get inventory() : Item[] {
		return this._inventory;
	}
}
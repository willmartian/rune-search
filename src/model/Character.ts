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

	die(): void {}

	playerCollision(): void {
		while (this._health > 0 && game.player.health > 0) {
			game.player.attack(this);
			this.attack(game.player);
			console.log("enemy battled");
		}
		if (game.player.health == 0) {
			game.player.die();
		}
	}

	get inventory(): Item[] {
		return this._inventory;
	}

	get health(): number {
		return this._health;
	}

	set health(health: number) {
		this._health = health;
	}

	get attackDamage(): number {
		return this._attackDamage;
	}

	set attackDamage(attackDamage: number) {
		this._attackDamage;
	}
}
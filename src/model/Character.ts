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

	//TODO
	die(): void {}

	playerCollision(): void {
		while (this.isAlive() && game.player.isAlive()) {
			game.player.attack(this);
			this.attack(game.player);
			console.log("enemy battled");
		}
		if (game.player.isDead()) {
			game.player.die();
		}
	}

	isDead(): boolean {
		return !(this._health > 0);
	}

	isAlive(): boolean {
		return (this._health > 0);
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

	inventoryToString(): string {
		let s: string = "Inventory: ";
		if (this._inventory.length > 0) {
			s += this._inventory[0].name;
			for (let i = 1; i < this._inventory.length; i++) {
				s += ", " + this._inventory[i].name;
			}
		}
		return s;
	}
}
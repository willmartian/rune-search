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

	removeItem(item: Item): void {
		let index = this._inventory.indexOf(item);
		this._inventory.splice(index, 1);
	}

	//TODO
	die(): boolean {
		// if (!this.isDead) {
		// 	if(game.tileMap.removeEntity(this)) {
		// 		this.isDead = true;
		// 		game.deadEntities.push(this);
		// 		return true;
		// 	}
		// }
		for (let item of this._inventory) {
			game.colliding.push(item);
		}
		return false;
	}

	playerCollision(): void {
		// while (this.isAlive() && Game.player.isAlive()) {
		// 	Game.player.attack(this);
		// 	this.attack(Game.player);
		// 	console.log("enemy battled");
		// }
		// if (Game.player.isDead()) {
		// 	Game.player.die();
		// }
		if (!Battle.active) {
			// let b = new Battle(this._health, this._name, 3);
			let b = new Battle(this, 3);
			game.battle = b;
			Battle.active = true;
		}
		super.playerCollision();
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

	giveItem(item: Item): void {
		this._inventory.push(item);
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
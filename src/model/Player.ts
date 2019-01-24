/// <reference path="../_references.ts" />

class Player extends Character {
	constructor(name: string) {
		super(name);
		super._health = 10;
		super._attackDamage = 1;
		super._active = true;
	}

	//hidden traps around level that makes your hero name longer
	//potions that make your hero name shorter 
}
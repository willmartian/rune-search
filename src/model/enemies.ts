/// <reference path="../_references.ts" />

let enemies = {

	Dragon: class extends Character {
		constructor() {
			super("Dragon");
			super._health = 6;
			super._attackDamage = 2;
		}
	},

	Goblin: class extends Character {
		constructor() {
			super("Goblin");
			super._health = 6;
			super._attackDamage = 2;
		}
	},

	Rat: class extends Character {
		constructor() {
			super("Rat");
			super._health = 1;
			super._attackDamage = 2;
		}
	},

	Robot: class extends Character {
		constructor() {
			super("Robot");
			super._health = 1;
			super._attackDamage = 2;
		}
	},

	Unicorn: class extends Character {
		constructor() {
			super("Unicorn");
			super._health = 6;
			super._attackDamage = 2;
		}
	},

	Zombie: class extends Character {
		constructor() {
			super("Zombie");
			super._health = 6;
			super._attackDamage = 2;
		}
	}
}
/// <reference path="../_references.ts" />

let enemies = {

	Dinosaur: class extends Character {
		constructor() {
			super("Dinosaur");
			super._health = 6;
			super._attackDamage = 2;
		}
	},

	Ghoul: class extends Character {
		constructor() {
			super("Ghoul");
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
			super._health = 2;
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

	Wizard: class extends Character {
		constructor() {
			super("Wizard");
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
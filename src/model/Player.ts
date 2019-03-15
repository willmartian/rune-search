/// <reference path="../_references.ts" />

class Player extends Character {
	protected _party: Character[];
	protected _mana: Manager;
	protected _skills: Skill[];

	constructor(name: string) {
		super(name);
		super._health = 10;
		super._attackDamage = 1;
		super._active = true;
		this._party = [];
		this._mana = new Manager("aaaaa");
		this._skills = [skills.slap];
	}
	
	get mana(): Manager {
		return this._mana;
	}

	get skills(): Skill[] {
		return this._skills;
	}

	giveSkill(s: Skill): void {
		if (this._skills.indexOf(s) == -1) {
			this._skills.push(s);
		}
	}

	revokeSkill(n: string): void {
		let s = skills[n];
		let index = this._skills.indexOf(s);
		if (index != -1) {
			this._skills.splice(index, 1);
		}
	}

	playerCollision() {}
}
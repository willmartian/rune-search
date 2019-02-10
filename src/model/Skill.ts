/// <reference path="../_references.ts" />

class Skill {

	static vowels: string[] = ["a", "e", "i", "o", "u"];

	protected _name: string;
	protected _cost: Manager;
	protected _effect: Function;

	constructor(name: string, effect: Function) {
		this._name = name;
		this._effect = effect;
		this._cost = new Manager(name);
	}

	get name(): string {
		return this._name;
	}

	get cost(): Manager {
		return this._cost;
	}

	execute(b: Battle) {
		this._effect.call(this, b);
	}

	static makeDamageEffect(damageAmount: number) {
		return function(b: Battle) {
			b.damage(damageAmount);
		}
	}

}
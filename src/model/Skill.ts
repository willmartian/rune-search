/// <reference path="../_references.ts" />

class Skill {

	static vowels: string[] = ["a", "e", "i", "o", "u"];

	protected _name: string;
	protected _desc: string;
	protected _cost: Manager;
	protected _effect: Function;

	constructor(name: string, desc: string, effect: Function) {
		this._name = name;
		this._desc = desc;
		this._effect = effect;
		this._cost = new Manager(name);
	}

	get name(): string {
		return this._name;
	}

	get desc(): string {
		return this._name;
	}

	get cost(): Manager {
		return this._cost;
	}

	execute(b: Battle) {
		this._effect.call(undefined, b);
	}

	static makeDamageEffect(damageAmount: number) {
		return function(b: Battle) {
			b.damage(damageAmount);
		}
	}

	static makeRepeatedEffect(effect: Function, repetitions: number) {
		return function(b: Battle) {
			for (let i = 0; i < repetitions; i++) {
				effect.call(undefined, b);
			}
		}
	}

}
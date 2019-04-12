/// <reference path="../_references.ts" />

class Skill {

	static vowels: string[] = ["a", "e", "i", "o", "u"];

	protected _name: string;
	protected _desc: string;
	protected _cost: Manager;
	protected _effect: Function;
	protected _camelCaseName: string;

	constructor(name: string, desc: string, effect: Function) {
		this._name = name;
		this._desc = desc;
		this._effect = effect;
		this._cost = new Manager(name);
		this._camelCaseName = this.generateCamelCaseName();
	}

	get name(): string {
		return this._name;
	}

	get desc(): string {
		return this._desc;
	}

	get cost(): Manager {
		return this._cost;
	}

	get camelCaseName(): string {
		return this._camelCaseName;
	}

	private generateCamelCaseName(): string {
		let splat = this.name.split(" ");
		let r = splat[0].toLowerCase();
		for (let i = 0; i < splat.length; i++) {
			let curr = splat[i].toLowerCase();
			let firstLetter = curr.substring(0, 1);
			let backhalf = curr.substring(1);
			r += firstLetter.toUpperCase() + backhalf;
		}
		return r;
	}

	execute(b: Battle) {
		this._effect.call(undefined, b);
	}

	static makeDamageEffect(damageAmount: number): Function {
		return function(b: Battle) {
			b.damage(damageAmount);
		}
	}

	static makeCountdownEffect(countdownAmount: number): Function {
		return function(b: Battle) {
			b.changeCountdown(countdownAmount);
		}
	}

	static makeCountdownSettingEffect(countdownAmount: number): Function {
		return function(b: Battle) {
			b.countdown = countdownAmount;
		}
	}

	static makeStatusEffect(status: StatusEffect): Function {
		return function(b: Battle) {
			b.addStatus(status.clone());
		}
	}

	static makeRepeatedEffect(effect: Function, repetitions: number): Function {
		return function(b: Battle) {
			for (let i = 0; i < repetitions; i++) {
				effect.call(undefined, b);
			}
		}
	}

	static concatEffect(...effects: Function[]): Function {
		return function(b: Battle) {
			for (let i = 0; i < effects.length; i++) {
				effects[i].call(undefined, b);
			}
		}
	}

	static revokeSkill(skillName: string): Function {
		return function(b: Battle) {
			b.player.revokeSkill(skills[skillName]);
		}
	}

}
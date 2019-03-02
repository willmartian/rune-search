/// <reference path="../_references.ts" />

class StatusEffect {
	
	private _name: string;
	private _countdown: number;
	private _kind: string;
	private _turnEndCallback: Function;

	constructor(n: string, c: number, k: string) {
		this._name = n;
		this._countdown = c;
		this._kind = k;
		this._turnEndCallback = this.trivialFunction();
	}

	get countdown() {
		return this._countdown;
	}

	get kind() {
		return this._kind;
	}

	get name() {
		return this._name;
	}

	set turnEndCallback(f: Function) {
		this._turnEndCallback = f;
	}

	increment(x: number = 1) {
		this._countdown += x;
	}

	decrement(x: number = 1) {
		this._countdown -= x;
	}

	turnEnd(b: Battle) {
		this._turnEndCallback.call(this, b);
	}

	private trivialFunction() {
		return function() {};
	}
	
	static poisonStatus(countdown: number): StatusEffect {
		let status = new StatusEffect("Poison", countdown, "poison");
		status.turnEndCallback = function(b: Battle) {
			b.damage(this._countdown);
			this._countdown--;
		}
		return status;
	}

}
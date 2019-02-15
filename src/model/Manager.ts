/// <reference path="../_references.ts" />

class Manager { //Mana-ger. Get it?

	protected _a: number;
	protected _e: number;
	protected _i: number;
	protected _o: number;
	protected _u: number;

	constructor() {
		this._a = 0;
		this._e = 0;
		this._i = 0;
		this._o = 0;
		this._u = 0;
	}

	get a(): number {
		return this._a;
	}

	set a(x: number) {
		this._a = x;
	}

	get e(): number {
		return this._e;
	}

	set e(x: number) {
		this._e = x;
	}

	get i(): number {
		return this._i;
	}

	set i(x: number) {
		this._i = x;
	}

	get o(): number {
		return this._o;
	}

	set o(x: number) {
		this._o = x;
	}

	get u(): number {
		return this._a;
	}

	set u(x: number) {
		this._u = x;
	}

	getAmount(which: string): number {
		switch (which.toLowerCase()) {
			case "a":
				return this._a;
			case "e":
				return this._e;
			case "i":
				return this._i;
			case "o":
				return this._o;
			case "u":
				return this._u;
		}
	}

	setAmount(which: string, x: number) {
		switch (which.toLowerCase()) {
			case "a":
				this._a = x;
				break;
			case "e":
				this._e = x;
				break;
			case "i":
				this._i = x;
				break;
			case "o":
				this._o = x;
				break;
			case "u":
				this._u = x;
				break;
		}
	}

	increase(which: string, x: number) {
		switch (which.toLowerCase()) {
			case "a":
				this._a += x;
				break;
			case "e":
				this._e += x;
				break;
			case "i":
				this._i += x;
				break;
			case "o":
				this._o += x;
				break;
			case "u":
				this._u += x;
				break;
		}
	}

	decrease(which: string, x: number) {
		switch (which.toLowerCase()) {
			case "a":
				this._a -= x;
				break;
			case "e":
				this._e -= x;
				break;
			case "i":
				this._i -= x;
				break;
			case "o":
				this._o -= x;
				break;
			case "u":
				this._u -= x;
				break;
		}
	}

	toString(): string {
		return "Mana Runes (A: " + this._a + ", " + "E: " + this._e + ", " + "I: " + this._i + ", " + "O: " + this._o + ", " + "U: " + this._u + ")";
	}

}
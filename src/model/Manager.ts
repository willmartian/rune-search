/// <reference path="../_references.ts" />

class Manager { //Mana-ger. Get it?

	static vowels: string[] = ["a", "e", "i", "o", "u"];

	protected _a: number;
	protected _e: number;
	protected _i: number;
	protected _o: number;
	protected _u: number;


	constructor(word: string = "") {
		this._a = 0;
		this._e = 0;
		this._i = 0;
		this._o = 0;
		this._u = 0;
		word = word.toLowerCase();
		for (let i = 0; i < word.length; i++) {
			let char = word.charAt(i);
			if (Manager.vowels.indexOf(char) != -1) {
				this.increase(char, 1);
			}
		}
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

	setAmount(which: string, x: number): void {
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

	increase(which: string, x: number): void {
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

	decrease(which: string, x: number): void {
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

	add(other: Manager): void {
		for (let letter in Manager.vowels) {
			this.increase(letter, other.getAmount(letter));
		}
	}

	subtract(other: Manager): void {
		for (let letter in Manager.vowels) {
			this.decrease(letter, other.getAmount(letter));
		}
	}

	multiply(scalar: number): void {
		scalar = Math.round(scalar);
		for (let letter in Manager.vowels) {
			this.setAmount(letter, this.getAmount(letter) * scalar);
		}
	}

	fitsInto(other: Manager): boolean {
		for (let letter in Manager.vowels) {
			if (this.getAmount(letter) > other.getAmount(letter)) {
				return false;
			}
		}
		return true;
	}

	toString(): string {
		return "Mana Runes (A: " + this._a + ", " + "E: " + this._e + ", " + "I: " + this._i + ", " + "O: " + this._o + ", " + "U: " + this._u + ")";
	}

}
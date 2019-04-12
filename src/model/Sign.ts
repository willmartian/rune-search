/// <reference path="../_references.ts" />

class Sign extends Entity {
	private _funcs: any[];
	constructor(name: string) {
		super(name);
		this._funcs = [];
	}

	playerCollision(): void {
		for (let func of this._funcs) {
			// try {
				func.call(null);
			// } catch {
				console.log("too bad so sad");
			// }
		}
		return;
	}

	addFunc(func: () => any) {
		this._funcs.push(func);
	}




}
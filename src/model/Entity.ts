/// <reference path="../_references.ts" />

abstract class Entity {
	protected _name: string;
	protected _location: number[][]; //x,y pairs
	protected _active: boolean;

	constructor(name: string) {
		this._name = name;
		this._location = [];
		this._active = false;
	}

	//override this default method method
	abstract playerCollision(): void;

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get location(): number[][] {
		return this._location;
	}

	set location(location: number[][]) {
		this._location = location;
	}

	get active(): boolean {
		return this._active;
	}

	set active(active: boolean) {
		this._active = active;
	}
}
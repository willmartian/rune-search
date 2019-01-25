/// <reference path="../_references.ts" />

abstract class Entity {
	protected _name: string;
	protected _location: number[][]; //x,y pairs
	protected _active: boolean; //not currently in use
	protected _ascii: string; //not currently in use

	//game has a list of ALL ENTITIES. Each entitity has a set of xy locations. Iterate over list of entities, placing each letter to respective bucket. 
	//make an update loop function that does this, reset each bucket to empty at start of loop.

	constructor(name: string) {
		this._name = name;
		this._location = [];
		this._active = false;
		// this._ascii = '';
	}

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

	get ascii(): string {
		return this._ascii;
	}

	set ascii(ascii: string) {
		this._ascii = ascii;
	}
}
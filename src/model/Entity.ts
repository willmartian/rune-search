/// <reference path="../_references.ts" />

abstract class Entity {
	protected _name: string;
	protected _location: number[][]; //x,y pairs
	// protected _active: boolean;
	protected _head: number[]; //x,y
	protected _dir: number[]; //xstep,ystep - head's x + dir's x = next x coord
	protected _oldDirs: number[][];

	constructor(name: string) {
		this._name = name;
		this._location = [];
		// this._active = false;
		this._oldDirs = [];
	}

	//override this default method method
	playerCollision(): void {
		// let that = this;
		// window.setTimeout(function() {
		// game.tileMap.removeEntity(that);
		// }, 1000);	
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get length(): number {
		return this._name.length;
	}

	get location(): number[][] {
		return this._location;
	}

	set location(location: number[][]) {
		this._location = location;
		if (location.length < 2) {
			return;
		}
		this._head = location[0];
		this._dir = [location[1][0] - this._head[0], location[1][1] - this._head[1]];
	}

	locationIncludes(x: number, y: number) {
		for (let i = 0; i < this._location.length; i++) {
			if (this._location[i][0] == x && this._location[i][1] == y) {
				return true;
			}
		}
		return false;
	}

	get head(): number[] {
		return this._head;
	}

	set head(head: number[]) {
		this._head = head;
	}

	get tail(): number[] {
		return [this._head[0] + this.length * this._dir[0], this._head[1] + this.length * this._dir[1]]
	}

	get dir(): number[] {
		return this._dir;
	}

	set dir(dir: number[]) {
		this._dir = dir;
	}

	get oldDirs(): number[][] {
		return this._oldDirs;
	}

	set oldDirs(oldDirs: number[][]) {
		this._oldDirs = oldDirs;
	}

	get reverseDir() {
		return [this._dir[0] * -1, this._dir[1] * -1];
	}

	// get active(): boolean {
	// 	return this._active;
	// }

	// set active(active: boolean) {
	// 	this._active = active;
	// }
}
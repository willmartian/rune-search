/// <reference path="../_references.ts" />

class Tile {
	//Data structure representing a piece of the word search
	private _letters: string[];
	private _entities: Entity[];
	private _colors: number[][];

	constructor() {
		this._entities = [];
		this._letters = [];
		this._colors = [];
	}

	get letters(): string[] {
		return this._letters;
	}

	set letters(letters: string[]) {
		this._letters = letters;
	}

	addLetter(letter: string): void {
		this._letters.push(letter);
	}

	removeLetter(letter: string): void {
		let index = this._letters.indexOf(letter);
		this._letters.splice(index, 1);
	}

	getTopLetter(): string {
		return this._letters[this._letters.length - 1];
	}

	get entities(): Entity[] {
		return this._entities;
	}

	set entities(entities: Entity[]) {
		this._entities = entities;
	}

	addEntity(entity: Entity): void {
		this._entities.push(entity);
	}

	removeEntity(entity: Entity): void {
		let index = this._entities.indexOf(entity);
		this._entities.splice(index, 1);
	}

	get colors(): number[][] {
		return this._colors;
	}

	set colors(colors: number[][]) {
		this._colors = colors;
	}

	addColor(color: number[]): void {
		this._colors.push(color);
	}

	removeColor(color: number[]): void {
		let index = this._colors.indexOf(color);
		this._colors.splice(index, 1);
	}

	getTopColor(): number[] {
		return this._colors[this._colors.length - 1];
	}
}
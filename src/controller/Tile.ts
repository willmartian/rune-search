/// <reference path="../_references.ts" />

class Tile {
	//Data structure representing a piece of the word search
	private _letters: string[];
	private _entities: Entity[];

	constructor() {
		this._entities = [];
		this._letters = [];
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

	removeLetterAtIndex(index: number): void {
		this._letters.splice(index, 1);
	}

	removeTopLetter(): void {
		this._letters.pop();
  	} 
   
	changeLetter(index: number, newLetter: string) {
		this._letters[index] = newLetter;
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

	containsEntity(entity: Entity): boolean {
		return this._entities.indexOf(entity) != -1;
	}

	removeEntity(entity: Entity): void {
		for (let i = 0; i < this._entities.length; i++) {
			if (this._entities[i] == entity) {
				this._entities.splice(i, 1);
			}
		}
	}

	entityIndex(entity: Entity): number {
		return this._entities.indexOf(entity);
	}

	getVowels(): string[] {
		let vowels: string[] = [];
		for (let letter of this._letters) {
			if ("aieou".includes(letter.toLowerCase())) {
				vowels.push(letter);
			}
		}
		return vowels;
	}
}
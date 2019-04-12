/// <reference path="../_references.ts" />

class Game {
	private _tileMap: TileMap;
	private static _player: Player;
	private _selected: Tile[];
	private _colliding: Entity[];
	private _entities: Entity[];
	private _currentLevel: number;
	private _dead: Entity[];
	private _battle: Battle;
	private _timeScores: number[][];

	constructor() {
		this._selected = [];
		this._colliding = [];
		this._dead = [];
		Game._player = new Player("Goat");
		this._tileMap = new TileMap(30,15);
		this._entities = [
			Game._player
		];
		this._tileMap.insertEntities(this._entities);	
		this._currentLevel = -1;
		this._timeScores = [];
	}

	//Only adding one entity to colliding, TODO
	checkCollisions(entity: Entity): void {
		// let tiles: Tile[] = this._tileMap.getEntityTiles(entity);
		let tiles: Tile[] = this._tileMap.getTiles([entity.head]);
		let colliding: Entity[] = [];
		for (let tile of tiles) {
			for (let otherEntity of tile.entities) {
				if (!colliding.includes(otherEntity) && entity !== otherEntity) {//&& otherEntity.constructor.name !== "Ground") {
					colliding.push(otherEntity);
					otherEntity.playerCollision();
				}
			}
		}
		this._colliding = colliding;
	}

	get colliding(): Entity[] {
		return this._colliding;
	}

	get entities(): Entity[] {
		return this._entities;
	}

	set entities(entities: Entity[]) {
		this._entities = entities;
	}

	get battle(): Battle {
		return this._battle;
	}

	set battle(battle: Battle) {
		this._battle = battle;
	}

	get dead(): Entity[] {
		return this._dead;
	}

	set dead(dead: Entity[]) {
		this._dead = dead; 
	}

	get tileMap(): TileMap {
		return this._tileMap;
	}

	set tileMap(tileMap: TileMap) {
		this._tileMap = tileMap;
	}

	nextLevel(): boolean {
		let next: () => TileMap;
		try {
			next = levels[this._currentLevel + 1]
		} catch(e) {
			console.log(e);
			return false;
		}
		this.changeLevel(next);
		this._currentLevel += 1;
		let skillGiven = Game.player.giveRandomSkill();
		//TODO: Somehow tell the player what skill they have been given
		return true;
	}

	changeLevel(level: () => TileMap): TileMap {
		let old: TileMap = this._tileMap;
		let newMap: TileMap = level.call(this);
		this._tileMap = newMap;
		Game.player.hunger = 1;
		this._timeScores.push(playerMenu.time);
		playerMenu.time = [0,0,0];
		main.draw();
		// if (level == levels[0]) {
		main.resize();
		// }
		return old;
	}

	static get player(): Player {
		return Game._player;
	}

	static set player(player: Player) {
		Game._player = player;
	}

	get selected(): Tile[] {
		return this._selected;
	}

	set selected(tiles: Tile[]) {
		this._selected = tiles;
	}

	updatePlayerMana(tiles: Tile[]) {
		for (let tile of tiles) {
			let vowels: string[] = tile.getVowels();
			for (let vowel of vowels) {
				Game.player.mana.increase(vowel, 1);
			}
		}
		//temporary hacky solution: removes the e and o added from "HERO". TODO
		Game.player.mana.decrease("a", 1);
		Game.player.mana.decrease("o", 1);
		// console.log(Game.player.mana.toString());
	}

	moveSnake(entity: Entity, dir: number[]) {
		if (dir == [0,0] || !dir) {
			return null;
		}

		entity.oldDirs.unshift(dir);
		if (entity.oldDirs.length > entity.location.length) {
			entity.oldDirs.pop();
		}

		let oldLocation: number[][] = entity.location;
		let oldHead: number[] = entity.head;
		let newLocation: number[][] = [];

		let newHead: number[] = [(oldHead[0] - dir[0]), (oldHead[1] - dir[1])];
		if (this.tileMap.getTile(newHead[0],newHead[1]) != null
			&& this.tileMap.getTile(newHead[0],newHead[1]).containsEntity(entity)) {
			return oldLocation;
		}
		newLocation.push(newHead);
		oldLocation = oldLocation.slice(0,-1);
		newLocation = newLocation.concat(oldLocation);
		return newLocation;

	}

	undoSnake(entity: Entity) {
		
		let oldLocation: number[][] = entity.location;
		let oldBottom: number[] = oldLocation[oldLocation.length - 1];
		let newLocation: number[][] = [];
		let dir = entity.oldDirs[entity.oldDirs.length - 1];

		let newBottom: number[] = [(oldBottom[0] + dir[0]), (oldBottom[1] + dir[1])];
		if (this.tileMap.getTile(newBottom[0],newBottom[1]) != null
			&& this.tileMap.getTile(newBottom[0],newBottom[1]).containsEntity(entity)) {
			return oldLocation;
		}
		newLocation.push(newBottom);
		oldLocation = oldLocation.slice(1,0);
		newLocation = oldLocation.concat(newLocation);
		return newLocation;
	}

	move(entity: Entity, newLocation: Tile[]): boolean {
		//check length of intended location
		if (entity.name.length != newLocation.length) {
			return false;
		}

		if (newLocation.includes(null)) {
			return false;
		}
		//check if location contains at least one instance of entity
		let i: number;
		for (i = newLocation.length - 1; i >= 0; i--) {
			if (newLocation[i].entities.includes(entity)) {
				break;
			}
		}
		if (i == -1) {
			return false;
		}

		//check if selected is in a line
		// let xdiff: number = Math.abs(this._tileMap.getTileLocation(newLocation[0])[0] - this._tileMap.getTileLocation(newLocation[newLocation.length - 1])[0]);
		// let ydiff: number = Math.abs(this._tileMap.getTileLocation(newLocation[0])[1] - this._tileMap.getTileLocation(newLocation[newLocation.length - 1])[1]);
		// if ((ydiff != 3 && ydiff != 0) || (xdiff != 3 && xdiff != 0)) {
		// 	return false;
		// }

		//if all conditions were met, move to new location
		let oldLocation: Tile[] = this._tileMap.getEntityTiles(entity);
		for (let i = 0; i < newLocation.length; i++) {
			let index = oldLocation[i].entityIndex(entity);
			oldLocation[i].removeEntity(entity);
			oldLocation[i].removeLetterAtIndex(index);

			newLocation[i].addEntity(entity);
			newLocation[i].addLetter(entity.name.charAt(i));
		}

		let curLocation = [];
		for (let i = 0; i < newLocation.length; i++) {
			curLocation.push(this._tileMap.getTileLocation(newLocation[i]));
		}
		entity.location = curLocation;

		this._selected = [];

		if (entity == Game._player) {
			this.updatePlayerMana(newLocation);
		}
		return true;
	}

	headshift(entity: Entity, mul: number): boolean {
		let newHead = entity.head;
		newHead[0] += mul * entity.dir[0];
		newHead[1] += mul * entity.dir[1];
		let line = this._tileMap.getTiles(this._tileMap.line(newHead, entity.dir, entity.length));
		if (line.indexOf(null) == -1 && this.move(entity, line)) {
			entity.head = newHead;
			return true;
		} else {
			return false;
		}
	}

	// changeDir(entity: Entity, dir: number[]): boolean {
	// 	let line = this._tileMap.getTiles(this._tileMap.line(entity.head, dir, entity.length));
	// 	if (line.indexOf(null) == -1 && this.move(entity, line)) {
	// 		entity.dir = dir;
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	rotateDir(entity: Entity, clockwise: boolean): boolean {
		let newDir = this._tileMap.rotateDir(entity.dir, clockwise);
		entity.dir = newDir;
		// return this.changeDir(entity, newdir);
		return true;
	}

	toJSON(): string {
		const proto = Object.getPrototypeOf(this);
		const jsonObj: any = Object.assign({}, this);

		Object.entries(Object.getOwnPropertyDescriptors(proto))
		.filter(([key, descriptor]) => typeof descriptor.get === 'function')
		.map(([key, descriptor]) => {
		  if (descriptor && key[0] !== '_') {
		    try {
		      const val = (this as any)[key];
		      jsonObj[key] = val;
		    } catch (error) {
		      console.error(`Error calling getter ${key}`, error);
		    }
		  }
		});

		return jsonObj;
	}
}
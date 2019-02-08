/// <reference path="../_references.ts" />

class Game {
	private _tileMap: TileMap;
	private _player: Player;
	private _selected: Tile[];
	private _colliding: Entity[];


	constructor() {
		this._selected = [];

		//createWorld
		this._tileMap = new TileMap(15,15);

		//createEntities
		this._player = new Player("Hero");
		this._tileMap.insertEntities([this._player,new Door(),new Key(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin()]);
		this._colliding = [];
	}

	//Only adding one entity to colliding, TODO
	checkCollisions(entity: Entity): void {
		let tiles: Tile[] = this._tileMap.getEntityTiles(entity);
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

	get tileMap(): TileMap {
		return this._tileMap;
	}

	newLevel(): void {
		let level: TileMap = new TileMap(15,15);
		level.insertEntities([this._player,new Door(),new Key(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin(),new Goblin()]);
		this._colliding = [];
		this._tileMap = level;
	}

	get player(): Player {
		return this._player;
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
				game.player.mana.increase(vowel, 1);
			}
		}
		//temporary hacky solution: removes the e and o added from "HERO". TODO
		game.player.mana.decrease("e", 1);
		game.player.mana.decrease("o", 1);
		console.log(game.player.mana.toString());
	}

	move(entity: Entity, newLocation: Tile[]): boolean {
		//check length of intended location
		if (entity.name.length != newLocation.length) {
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
		let xdiff: number = Math.abs(this._tileMap.getTileLocation(newLocation[0])[0] - this._tileMap.getTileLocation(newLocation[newLocation.length - 1])[0]);
		let ydiff: number = Math.abs(this._tileMap.getTileLocation(newLocation[0])[1] - this._tileMap.getTileLocation(newLocation[newLocation.length - 1])[1]);
		if ((ydiff != 3 && ydiff != 0) || (xdiff != 3 && xdiff != 0)) {
			return false;
		}

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

		if (entity == this._player) {
			this.updatePlayerMana(newLocation);
		}
		return true;
	}

	headshift(entity: Entity, mul: number): boolean {
		let newHead = entity.head;
		newHead[0] += mul * entity.dir[0];
		newHead[1] += mul * entity.dir[1];
		let line = this._tileMap.getTiles(this._tileMap.line(newHead, entity.dir, entity.length));
		if (line.indexOf(null) == -1 && game.move(entity, line)) {
			entity.head = newHead;
			return true;
		} else {
			return false;
		}
	}

	changeDir(entity: Entity, dir: number[]): boolean {
		let line = this._tileMap.getTiles(this._tileMap.line(entity.head, dir, entity.length));
		if (line.indexOf(null) == -1 && game.move(entity, line)) {
			entity.dir = dir;
			return true;
		} else {
			return false;
		}
	}

	rotateDir(entity: Entity, clockwise: boolean): boolean {
		let newdir = this._tileMap.rotateDir(entity.dir, clockwise);
		return this.changeDir(entity, newdir);
	}
}
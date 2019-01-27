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

	checkPlayerCollision = function(tile) {
		if (tile.entities.includes(game.player) && tile.entities.length > 2) {
			this._colliding = tile.entities;
			for (let entity of this._colliding) {
				entity.collideWithPlayer(game.player);
			}
		}
		
	}

	get colliding(): Entity[] {
		return this._colliding;
	}

	get tileMap(): TileMap {
		return this._tileMap;
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
			oldLocation[i].removeEntity(entity);
			let oldLetter: string = oldLocation[i].getTopLetter();
			oldLocation[i].removeLetter(oldLetter);

			newLocation[i].addEntity(entity);
			newLocation[i].addLetter(oldLetter);	
		}

		entity.location = [];
		for (let i = 0; i < newLocation.length; i++) {
			entity.location.push(this._tileMap.getTileLocation(newLocation[i]));
		}
		this._selected = [];
		return true;
	}
}
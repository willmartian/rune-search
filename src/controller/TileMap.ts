/// <reference path="../_references.ts" />

//rect only
class TileMap {
	private _tiles: Tile[][];
	private _entities: Entity[];
	private _width: number;
	private _height: number;



	constructor(width: number, height: number) {
		this._width = width;
		this._height = height;
		this._entities = [];
		this._tiles = new Array<Array<Tile>>(this._width);
		for (let x = 0; x < this._width; x++) {
			this._tiles[x] = new Array<Tile>(this._height);
			for (let y = 0; y < this._height; y++) {
				let entity: Entity = new Ground();
				entity.location.push([x,y]);
				this._tiles[x][y] = new Tile();
				this._tiles[x][y].addLetter(entity.name);
				this._tiles[x][y].addEntity(entity);
				this._entities.push(entity);
			}
		}
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	get tiles(): Tile[][] {
		return this._tiles;
	}

	get entities(): Entity[] {
		return this._entities;
	}

	randomPosDir(): number[] {
		let x: number = Math.floor(Math.random() * this._width),
			y: number = Math.floor(Math.random() * this._height);
		let directions: number[] = [-1, 0, 1];
		let xStep: number = directions[Math.floor((Math.random() * 3))];
		if (xStep == 0) {
			directions = [-1, 1];
		}
		let yStep: number = directions[Math.floor((Math.random() * 3))];
		return [x, y, xStep, yStep];
	}

	insertEntities(entities: Entity[]) {
		for (let i = 0; i < entities.length; i++) {
			this.insertEntity(entities[i]);
		}
	}

	insertEntity(entity: Entity): boolean {

		let posDir: number[] = this.randomPosDir();
		let x: number = posDir[0], y: number = posDir[1],
		xStep: number = posDir[2], yStep: number = posDir[3];

		let path: number[][] = [];
		let i: number;

		//Does entity name fit?
		for (i = 0; i < entity.name.length; i++) {
			if (x < this.width && x > 0 && y < this.height && y > 0) {
				let tile: Tile = this._tiles[x][y];
				if (tile.entities.length == 1 ||
						tile.getTopLetter() == entity.name.charAt(i)) {
					tile.addLetter(entity.name.charAt(i));
					path.push([x,y]);
					x += xStep;
					y += yStep;	
				} else {
					break;
				}
			} else {
				break;
			}
		}

		//If so, add entity to tile.
		if (i == entity.name.length) {
			entity.location = [];
			for (let location of path) {
				entity.location.push(location);
				let x: number = location[0];
				let y: number = location[1];
				this._tiles[x][y].addEntity(entity);
			}
			this._entities.push(entity);
			return true;
		} else {
			return this.insertEntity(entity);
		}
	}

	getTileLocation(tile: Tile): number[] {
		for (let x = 0; x < this._width; x++) {
			for (let y = 0; y < this._height; y++) {
				if (this._tiles[x][y] == tile) {
					return [x, y];
				}
			}
		}
	}

	getEntityTiles(entity: Entity): Tile[] {
		let entityTiles: Tile[] = new Array<Tile>();
		for (let i = 0; i < entity.location.length; i++) {
			let x: number = entity.location[i][0];
			let y: number = entity.location[i][1];
			entityTiles.push(this._tiles[x][y]); 
		}

		return entityTiles;
	}
}


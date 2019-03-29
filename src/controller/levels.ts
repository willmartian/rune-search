/// <reference path="../_references.ts" />


let levels = [
	
	function(): TileMap {
		let newMap = new TileMap(30,15);
		Game.player.addItem(new items.Key);
		let door: Door = new Door();
		door.name = "Start";
		game.entities = [
			Game.player,
			new Sign("Rune"),
			new Sign("Search"),
			door
		];
		// newMap.insertEntities(game.entities);
		newMap.insertEntityAt(game.entities[1], 10, 6, 1, 0);
		newMap.insertEntityAt(game.entities[2], 20, 6, 1, 0);
		newMap.insertEntityAt(game.entities[3], 15, 10, 1, 0);
		newMap.insertEntityAt(game.entities[0], 29, 14, 1, 0);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			Game.player,
			new enemies.Rat,
			new enemies.Rat,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		main.changeMusic("Exploratory_Final.mp3");
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			Game.player,
			new enemies.Goblin,
			new enemies.Goblin,
			new enemies.Goblin,
			new enemies.Goblin,
			new enemies.Rat,
			new enemies.Rat,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			Game.player,
			new enemies.Rat,
			new enemies.Rat,
			new enemies.Robot,
			new enemies.Robot,
			new enemies.Robot,
			new enemies.Robot,
			new enemies.Robot,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		main.changeMusic("Modern_Living.mp3");
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			Game.player,
			new enemies.Rat,
			new enemies.Rat,
			new enemies.Zombie,
			new enemies.Zombie,
			new enemies.Zombie,
			new enemies.Zombie,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			Game.player,
			new enemies.Rat,
			new enemies.Rat,
			new enemies.Dinosaur,
			new enemies.Dinosaur,
			new enemies.Dinosaur,
			new enemies.Dinosaur,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			Game.player,
			new Sign("Will"),
			new Sign("May"),
			new Sign("Rebekah"),
			new Sign("Helena"),
			new Sign("Jack")
		];
		newMap.insertEntities(game.entities);
		return newMap;
	}
]
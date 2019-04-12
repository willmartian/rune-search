/// <reference path="../_references.ts" />


let levels = [
	
	function(): TileMap {

		let newMap = new TileMap(15,15);
		Game.player.addItem(new items.Key);
		let door: Door = new WipeDoor();
		door.name = "Start";
		game.entities = [
			Game.player,
			new Sign("Rune"),
			new Sign("Search"),
			door
		];
		// newMap.insertEntities(game.entities);

		newMap.insertEntityAt(game.entities[1], 5, 5, 0, 1);
		newMap.insertEntityAt(game.entities[2], 4, 8, 1, 0);
		newMap.insertEntityAt(game.entities[3], 6, 12, 1, 0);
		newMap.insertEntityAt(game.entities[0], 10, 1, 1, 0);
		main.displayEntities(true);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,10);
		let rat_key = new enemies.Rat;
		rat_key.giveItem(new items.Key); 
		game.entities = [
			new enemies.Rat,
			rat_key,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		main.changeMusic("Exploratory_Final.mp3");
		main.displayEntities(false);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			new enemies.Wizard,
			new enemies.Goblin,
			new enemies.Goblin,
			new enemies.Goblin,
			new enemies.Rat,
			new enemies.Rat,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
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
		newMap.insertPlayer(Game.player);
		main.changeMusic("Modern_Living.mp3");
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(10,10);
		Game.player.addItem(new items.Key);
		game.entities = [
			new Shopkeep(),
			new Door(),
		];
		
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		main.changeMusic("Shopkeep.mp3");
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(20,15);
		game.entities = [
			new enemies.Rat,
			new enemies.Rat,
			new enemies.Zombie,
			new enemies.Zombie,
			new enemies.Ghoul,
			new enemies.Ghoul,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		main.changeMusic("Undeadication.mp3");
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			new enemies.Rat,
			new enemies.Rat,
			new enemies.Dinosaur,
			new enemies.Dinosaur,
			new enemies.Dinosaur,
			new enemies.Wizard,
			new items.Key,
			new Door()
		];
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		main.changeMusic("Bookends.mp3");
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			new Sign("Will"),
			new Sign("May"),
			new Sign("Rebekah"),
			new Sign("Helena"),
			new Sign("Jack"),
			new Sign("VGDev")
		];
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		main.changeMusic("Victory.mp3");
		main.displayEntities(true);
		return newMap;
	},

	function(): TileMap {
		let newMap = new TileMap(30,15);
		game.entities = [
			new Sign("Rune_Search"),
			new Sign("Exploratory_Final"),
			new Sign("Modern_Living"),
			new Sign("Undeadication"),
			new Sign("Bookends"),
			new Sign("Victory")
		];
		for (let e of game.entities) {
			e.addFunc(function() {
				main.changeMusic(e.name + ".mp3")
			});
		}
		newMap.insertEntities(game.entities);
		newMap.insertPlayer(Game.player);
		main.changeMusic(null);
		main.displayEntities(true);
		playerMenu.dialogueKey = "music";
		return newMap;
	}
]
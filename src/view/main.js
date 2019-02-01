/// <reference path="../_references.ts" />
let game;
let xml;
let playerMenu;
let collisionMenu;

let seed = function(sketch) {
	let font;
	let padding;
	let marginY, marginX;
	let COLORS;
	let bolded;
	let locationTest;

	// Runs first.
	sketch.preload = function() {
		// customFont = sketch.loadFont("./assets/fonts/fsex300-webfont.ttf");
		xml = sketch.loadXML('./assets/game-entities.xml');
		game = new Game();
	};

	// Runs once after preload().
	sketch.setup = function() {
		playerMenu = new PlayerMenu();
		collisionMenu = new CollisionMenu();

		let canvas = sketch.createCanvas(1000,1000);
		canvas.parent('word-search');
		padding = 30;
		marginY = 10;
		marginX = 10;
		bolded = false;
		locationTest = false;
		COLORS = {
			player: sketch.color(0, 0, 0),
			selected: sketch.color(160,160,160),
			active: sketch.color(120,0,120),
			empty: sketch.color(255,255,255),
		}
		sketch.resize();
	};

	//main loop of the application
	sketch.draw = function() {
		playerMenu.update();
		collisionMenu.update();

		sketch.background(255);
		for (let x = 0; x < game.tileMap.width; x++) {
		  	for (let y = 0; y < game.tileMap.height; y++) {
		  		let tile = game.tileMap.tiles[x][y];
		  		sketch.displayTile(tile, x, y);
		  		game.checkPlayerCollision(tile);
			}
		}
	};

	// Displays the rectangle and text of a Tile.
	sketch.displayTile = function(tile, x, y) {
		let offset = sketch.offsetMap(x, y);
		let xOff = offset[0];
		let yOff = offset[1];

  		sketch.setRectStyle(tile);
  		sketch.rect(marginX + x*padding + xOff, marginY + y*padding + yOff, padding, padding, 5); //5 is the roundess/radius of the corners

  		sketch.setTextStyle(tile);
  		sketch.text(tile.getTopLetter().toUpperCase(), marginX + x*padding + xOff, marginY + y*padding + yOff);
  	}

	sketch.offsetMap = function(x, y) {
		let theta = (sketch.frameCount + x + y)/10;
		let coord = [Math.cos(theta) * 5, Math.sin(theta) * 5];
		//uncomment to animate
		// return coord; 
		return [0, 0];
	}

	sketch.showEntities = function(tile) {
		if (tile.entities.length > 1) {
			sketch.textStyle(sketch.BOLD);
		} else {
			sketch.textStyle(sketch.NORMAL);
		}
	};

	sketch.setTextStyle = function(tile) {
		sketch.noStroke();
		sketch.textSize(16);
		// sketch.textFont(customFont);
		sketch.textFont("Courier");
		sketch.textAlign(sketch.CENTER, sketch.CENTER);
		
		if (tile.getTopLetter() == null) {
		  	tile.addLetter(" ");
  		}

  		if (tile.entities.includes(game.player)) {
  			sketch.fill(255);
  			sketch.textStyle(sketch.BOLD);
  		} else {
  			sketch.fill(0);
  			sketch.textStyle(sketch.NORMAL);
  		}

  		if (bolded) {
  			sketch.showAllEntities(tile);
  		}
	}

	sketch.setRectStyle = function(tile) {
		sketch.rectMode(sketch.CENTER);
		sketch.noStroke();
		if (game.selected.includes(tile)) {
			sketch.fill(COLORS.selected);
		} else if (tile.entities.includes(game.player)) {
			sketch.fill(COLORS.player);
			if (locationTest) {
				let loc = game.tileMap.getTileLocation(tile);
				if (game.player.locationIncludes(loc[0], loc[1])) {
					sketch.stroke(sketch.color(0, 255, 255));
				}
			}
		} else {
			sketch.fill(COLORS.empty);
		}
	};

	sketch.showAllEntities = function(tile) {
		if (tile.entities.length > 1) {
			sketch.textStyle(sketch.BOLD);
		} else {
			sketch.textStyle(sketch.NORMAL);
		}
	};

	sketch.keyPressed = function() {
		if (sketch.keyCode === sketch.ENTER) {
			game.move(game.player, game.selected);
		}
		console.log(sketch.keyCode);
		if (sketch.keyCode === 66) { //keyCode 66 = "b"
			bolded = !bolded;
		} else if (sketch.keyCode == 76) { //keyCode 74 = "l"
			locationTest = !locationTest;
		} else if (sketch.keyCode === 38) { //down arrow
			game.headshift(game.player, -1);
		} else if (sketch.keyCode === 40) { //up arrow
			game.headshift(game.player, 1);
		} else if (sketch.keyCode == 37) { //left arrow
			game.rotateDir(game.player, true);
		} else if (sketch.keyCode == 39) { //right arrow
			game.rotateDir(game.player, false);
		}
	};

	sketch.screenCoordToTile = function(screenX, screenY) {
		let coord = sketch.screenCoordSubmapper(screenX, screenY);
		let offset = sketch.offsetMap(coord[0], coord[1]);
		screenX -= offset[0];
		screenY -= offset[1];
		return sketch.screenCoordSubmapper(screenX, screenY);
	}

	sketch.screenCoordSubmapper = function(screenX, screenY) {
		let x = Math.round(sketch.map(screenX, marginX, marginX + (game.tileMap.width + 1)*padding, 0, game.tileMap.width + 1));
		let y = Math.round(sketch.map(screenY, marginY, marginY + (game.tileMap.height + 1)*padding, 0, game.tileMap.height + 1));
		return [x, y];
	}

	sketch.mouseDragged = function() {
		let mouseX = sketch.mouseX;
		let mouseY = sketch.mouseY;
		let coord = sketch.screenCoordToTile(mouseX, mouseY);
		let x = coord[0];
		let y = coord[1];
		if (x >= 0 && x < game.tileMap.width && y >= 0 && y < game.tileMap.height) {
			let tile = game.tileMap.tiles[x][y];
			if (!game.selected.includes(tile)) {
				game.selected.push(tile);
			}
		}
	}

	// Repeat of mouseDragged, but for individual presses.
	sketch.mousePressed = function() { 
		let mouseX = sketch.mouseX;
		let mouseY = sketch.mouseY;
		let coord = sketch.screenCoordToTile(mouseX, mouseY);
		let x = coord[0];
		let y = coord[1];
		if (x >= 0 && x < game.tileMap.width && y >= 0 && y < game.tileMap.height) {
			let tile = game.tileMap.tiles[x][y];
			if (!game.selected.includes(tile)) {
				game.selected.push(tile);
			} else {
				let index = game.selected.indexOf(tile);
				game.selected.splice(index, 1);
			}
		}
	}

	// Resizes canvas to match wordsearch length.
	sketch.resize = function() {
		sketch.resizeCanvas(game.tileMap.width*padding + marginX, game.tileMap.height*padding + marginY);
	};

};

let main = new p5(seed);
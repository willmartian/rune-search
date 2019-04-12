/// <reference path="../_references.ts" />
let game;
let xml;
let dialogueXML;
let playerMenu;
let collisionMenu;
let music;
let showCM;
// let walker;


let seed = function(sketch) {
	let font;
	let fontSize;
	let padding;
	let marginY, marginX;
	let COLORS;
	let showEntities;
	let showMana;
	let locationTest;
	let paused;

	// Runs first.
	sketch.preload = function() {
		customFont = sketch.loadFont("./assets/fonts/fsex300-webfont.ttf");
		xml = sketch.loadXML('./assets/game-entities.xml');
		dialogueXML = sketch.loadXML('./assets/game-dialogue.xml')
		music = sketch.createAudio('./assets/music/Rune_Search.mp3');
		game = new Game();
		playerMenu = new PlayerMenu();
		collisionMenu = new CollisionMenu();
	};

	// Runs once after preload().
	sketch.setup = function() {
		music.loop();
		// playerMenu = new PlayerMenu();
		// collisionMenu = new CollisionMenu();
		let canvas = sketch.createCanvas(1000,1000);
		sketch.noLoop();
		canvas.parent('word-search');
		marginY = 10;
		marginX = 10;
		fontSize = window.getComputedStyle(document.body).fontSize;
		padding = parseInt(fontSize)*2;
		showEntities = false;
		showMana = false;
		showCM = true;
		locationTest = false;
		paused = false;
		COLORS = {
			// player: sketch.color(0, 0, 0),
			player: sketch.color(255, 255, 255),
			selected: sketch.color(160,160,160),
			active: sketch.color(120,0,120),
			empty: sketch.color(255,255,255),
		}
		sketch.resize();
		sketch.translate(100, 100);
		// walker = setInterval(sketch.walk, 500);
		game.nextLevel();
	};

	//main loop of the application
	sketch.draw = function() {
		sketch.clear();
		game.checkCollisions(Game.player);
		for (let x = 0; x < game.tileMap.width; x++) {
		  	for (let y = 0; y < game.tileMap.height; y++) {
		  		let tile = game.tileMap.tiles[x][y];
		  		sketch.displayTile(tile, x, y);
			}
		}
		collisionMenu.update();
		playerMenu.update();
		sketch.updateWordBank();
		// sketch.scrollStyle();
	};

	sketch.pause = function() {
		let game = document.getElementById("game");
		let pauseMenu = document.getElementById("pause");
		if (!paused) {
			// clearInterval(walker);
			music.pause();
			game.classList.add("blur");
			pauseMenu.style.display = "flex";
			paused = true;
		} else {
			pauseMenu.style.display = "none";
			music.loop();
			game.classList.remove("blur");
			// walker = setInterval(sketch.walk, 1500);
			paused = false;
		}
	}

	sketch.changeMusic = function(fileName) {
		fileName = 'assets/music/' + fileName;
		music.pause();
		music = sketch.createAudio(fileName);
		music.loop();
	}

	sketch.updateWordBank = function() {
		let wb = document.getElementById("word-bank");
		let children = wb.childNodes;
		while (children[1]) {
   			wb.removeChild(children[1]);
		}
		for (let entity of game.entities) {
			let li = document.createElement('li');
			li.classList.add("word-bank-item");
			if (game.dead.includes(entity)) {
				li.style.setProperty("text-decoration", "line-through");
				li.style.setProperty("font-style", "italic");
			}
			li.appendChild(document.createTextNode(entity.name));
			wb.appendChild(li);
		}
	}

	// Displays the rectangle and text of a Tile.
	sketch.displayTile = function(tile, x, y) {
		let offset = sketch.offsetMap(x, y);
		let xOff = offset[0];
		let yOff = offset[1];

  		sketch.setRectStyle(tile);
  		sketch.rect(marginX + x*padding + xOff, marginY + y*padding + yOff, padding, padding, 5); //5 is the roundess/radius of the corners

  		sketch.setTextStyle(tile);
  		sketch.text(tile.getTopLetter().toUpperCase(), marginX + x*padding + xOff, marginY + y*padding + yOff - 2);
  	}

	sketch.offsetMap = function(x, y) {
		let theta = (sketch.frameCount + x + y)/10;
		let coord = [Math.cos(theta) * 5, Math.sin(theta) * 5];
		// return coord; //uncomment to animate
		return [0, 0];
	}

	sketch.walk = function() {
		console.trace();
		// game.headshift(Game.player, -1);
		if (collisionMenu.colliding.length > 0) {
			return;
		} else {
			let newLocation = game.moveSnake(Game.player, Game.player.dir);
			let tiles = game.tileMap.getTiles(newLocation);
			game.move(Game.player, tiles);
			Game.player.hunger += 1;
			sketch.draw();
		}
		// Game.player.hunger += 1;
	}

	sketch.canWalk = function() {
		return !paused && !collisionMenu.visible && playerMenu.dialogueKey == ""; 
	}


	sketch.setTextStyle = function(tile) {
		sketch.noStroke();
		sketch.textSize(parseInt(fontSize)*1.2);
		sketch.textFont(customFont);
		// sketch.textFont("Courier");
		sketch.textAlign(sketch.CENTER, sketch.CENTER);
		
		if (tile.getTopLetter() == null) {
		  	tile.addLetter(" ");
  		}

  		if (tile.entities.includes(Game.player)) {
  			// sketch.fill(255);
  			sketch.fill(0);
  			sketch.textStyle(sketch.BOLD);
  		} else {
  			// sketch.fill(0);
  			sketch.fill(255);
  			sketch.textStyle(sketch.NORMAL);
  		}
	}

	sketch.setRectStyle = function(tile) {
		sketch.rectMode(sketch.CENTER);
		if (showEntities) {
  			if (tile.entities.length > 1) {
			// sketch.textStyle(sketch.BOLD);
				sketch.stroke(255);
			} else {
			// sketch.textStyle(sketch.NORMAL);
				sketch.noStroke();
			}
  		}
  		// sketch.showAllEntities(tile);
		if (game.selected.includes(tile)) {
			sketch.fill(COLORS.selected);
		} else if (tile.entities.includes(Game.player)) {
			sketch.fill(COLORS.player);
			if (locationTest) {
				let loc = game.tileMap.getTileLocation(tile);
				if (Game.player.locationIncludes(loc[0], loc[1])) {
					sketch.stroke(sketch.color(0, 255, 255));
				}
			}
		} else {
			sketch.noFill();
		}

	};

	sketch.showColliding = function(tile) {
		for (let entity of tile.entities) {
			if (game.colliding.includes(entity)) {
				sketch.textStyle(sketch.BOLD);
				return;
			}
		}
		sketch.textStyle(sketch.NORMAL);
	};

	sketch.displayEntities = function(bool) {
		showEntities = bool;
	}

	sketch.keyPressed = function() {
		if (sketch.keyCode == 38) { //up arrow
			if (sketch.canWalk()) {
				sketch.walk();
			}
		} else if (sketch.key == "e") {
			showEntities = !showEntities;
		} else if (sketch.key == "n") {
			game.nextLevel();
		} else if (sketch.keyCode == 37) { //left arrow
			if (sketch.canWalk()) {
				game.rotateDir(Game.player, true);
				game.rotateDir(Game.player, true);
				sketch.walk();
			} else if (collisionMenu.visible
						&& collisionMenu.entity instanceof Character 
						&& collisionMenu.activeSkill > 0) {
				collisionMenu.activeSkill += -1;
			}
		} else if (sketch.keyCode == 39) { //right arrow
			if (sketch.canWalk()) {
				game.rotateDir(Game.player, false);
				game.rotateDir(Game.player, false);
				sketch.walk();
			} else if (collisionMenu.visible 
						&& collisionMenu.entity instanceof Character 
						&& collisionMenu.activeSkill < Game.player.skills.length - 1) {
					collisionMenu.activeSkill += 1;
			}
		} else if (sketch.key == "p") {
			sketch.pause();
		} else if (sketch.key == "z") {
			if (playerMenu.dialogueKey != "") {
				playerMenu.dialogueIndex += 1;
			} else if (Battle.active) {
				game.battle.enqueue(collisionMenu.getActiveSkill());
				game.battle.endTurn();
			} else if (collisionMenu.visible) {
				collisionMenu.closeMenu();
			}
		} else if (paused && sketch.key == "c") {
			game.changeLevel(levels[levels.length - 1]);
			sketch.pause();
		} else if (sketch.key == "m") {
			if (music.isLooping()) {
				music.pause();
			} else {
				music.loop();
			}
		}
 
		sketch.draw();
		return false
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

	// Resizes canvas to match wordsearch length.
	sketch.resize = function() {
		sketch.resizeCanvas(game.tileMap.width*padding + marginX, game.tileMap.height*padding + marginY);
	};
	// //TODO
	// sketch.saveGame = function() {
	// 	let saveState = JSON.stringify(game.toJSON());
	// 	localStorage.setItem("saveState", saveState);
	// }
	// //TODO
	// sketch.loadGame = function() {
	// 	// try {
	// 		let gameSeed = JSON.parse(localStorage.getItem("saveState"));
	// 		let game = new Game(gameSeed);
	// 	// } catch(err) {
	// 	// 	console.log(err);
	// 	// }
	// }

	// sketch.scrollStyle = function() {
	// 	let ws = document.getElementById("word-search");
	// 	let fade = document.getElementById("ws-fade");
	// 	if(ws.scrollHeight - ws.scrollTop !== ws.clientHeight) {
	// 		console.log("go down");
	// 		fade.classList.add("fade-bottom");
	// 	} else {
	// 		fade.classList.remove("fade-bottom");
	// 	}

	// 	if(ws.scrollTop !== 0) {
	// 		console.log("go up");
	// 		fade.classList.add("fade-top");
	// 	} else {
	// 		fade.classList.remove("fade-top");
	// 	}

	// 	if(ws.scrollWidth - ws.scrollLeft !== ws.clientWidth) {
	// 		//there is still more to the left 
	// 		console.log("go right");
	// 		fade.classList.add("fade-right");
	// 	} else {
	// 		fade.classList.remove("fade-right");
	// 	}

	// 	if(ws.scrollLeft !== 0) {
	// 		//there is still more to the left 
	// 		console.log("go left");
	// 		fade.classList.add("fade-left");
	// 	} else {
	// 		fade.classList.remove("fade-left");
	// 	}
	// }


	/* View in fullscreen */
	// sketch.openFullscreen = function() {
	//   let elem = document.documentElement;
	//   if (elem.requestFullscreen) {
	//     elem.requestFullscreen();
	//   } else if (elem.mozRequestFullScreen) { /* Firefox */
	//     elem.mozRequestFullScreen();
	//   } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	//     elem.webkitRequestFullscreen();
	//   } else if (elem.msRequestFullscreen) { /* IE/Edge */
	//     elem.msRequestFullscreen();
	//   }
	// }

	// /* Close fullscreen */
	// sketch.closeFullscreen = function() {
	//   if (document.exitFullscreen) {
	//     document.exitFullscreen();
	//   } else if (document.mozCancelFullScreen) { /* Firefox */
	//     document.mozCancelFullScreen();
	//   } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
	//     document.webkitExitFullscreen();
	//   } else if (document.msExitFullscreen) { /* IE/Edge */
	//     document.msExitFullscreen();
	//   }
	// }

};

let main = new p5(seed);
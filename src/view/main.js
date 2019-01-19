/// <reference path="../_references.ts" />

let game;
let font;
let padding;
let marginY, marginX;
let COLORS;

function preload() {
	font = loadFont("./assets/fonts/Blackwood_Castle.ttf");
	game = new Game();
}

function setup() {
	createCanvas(1000,1000);
	padding = 30;
	marginY = 50;
	marginX = 10;
	COLORS = {
		player: color(156, 218, 237),
		selected: color(239,255,177),
		active: color(120,120,120),
		empty: color(255,255,255),
	}
}

function draw() {
	background(255);
	displayTiles();
}

function displayTiles() {
	for (let x = 0; x < game.tileMap.width; x++) {
	  	for (let y = 0; y < game.tileMap.height; y++) {

	  		let tile = game.tileMap.tiles[x][y];
			setColor(tile);
			fill(tile.getTopColor());
	  		noStroke();
	  		rectMode(CENTER);
	  		rect(marginX + x*padding, marginY + y*padding, padding, padding, 5); 

	  		//uncomment below to bold all entities in maze
	  		// showEntities(tile);
	  		
	  		if (tile.getTopLetter() == null) {
	  			tile.addLetter(" ");
	  		}
	  		fill(0);
	  		textFont("Courier");
	  		textAlign(CENTER, CENTER);
	  		text(tile.getTopLetter().toUpperCase(), marginX + x*padding, marginY + y*padding);
	  	}
	}
}

function showEntities(tile) {
	if (tile.entities.length > 1) {
		textStyle(BOLD);
	} else {
		textStyle(NORMAL);
	}
}

function setColor(tile) {
	if (game.selected.includes(tile)) {
		tile.addColor(COLORS.selected);
	} else if (tile.entities.includes(game.player)) {
		tile.addColor(COLORS.player);
		if (tile.entities.length > 2) {
			fill(0);
				textFont("Courier");
				textAlign(CENTER, CENTER);
			text("You found a " + tile.entities[1].name + "! " + "Health: "+ tile.entities[1].health + ", Attack: " + tile.entities[1].attackDamage + "\n" , 700, 50);
		}
	} else {
		tile.addColor(COLORS.empty);
	}
}

function keyPressed() {
	if (keyCode === ENTER) {
		game.move(game.player, game.selected);
	}
}

function mousePressed() {
	if (mouseX >= marginX - padding && mouseX <= marginX + (game.tileMap.width + 1)*padding &&
			mouseY >= marginY - padding && mouseY <= marginY + (game.tileMap.height + 1)*padding) {
		let x = Math.round(map(mouseX, marginX, marginX + (game.tileMap.width + 1)*padding, 0, game.tileMap.width + 1));
		let y = Math.round(map(mouseY, marginY, marginY + (game.tileMap.height + 1)*padding, 0, game.tileMap.height + 1));
		
		let tile = game.tileMap.tiles[x][y];
		if (!game.selected.includes(tile)) {
			game.selected.push(tile);
		} else {
			let index = game.selected.indexOf(tile);
			game.selected.splice(index, 1);
		}
	}
}

/// <reference path="../_references.ts" />

var s = function(sketch) {

	let game;
	let font;
	let padding;
	let marginY, marginX;
	let COLORS;
	let bolded;

	sketch.preload = function() {
		// customFont = sketch.loadFont("./assets/fonts/Blackwood_Castle.ttf");
		xml = sketch.loadXML('./assets/art/ascii-art.xml');
		game = new Game();
	};

	sketch.setup = function() {
		let canvas = sketch.createCanvas(1000,1000);
		canvas.parent('word-search');
		padding = 30;
		marginY = 10;
		marginX = 10;
		bolded = false;
		COLORS = {
			player: sketch.color(0, 0, 0),
			// selected: sketch.color(255,255,255),
			selected: sketch.color(160,160,160),
			active: sketch.color(120,120,120),
			empty: sketch.color(255,255,255),
		}
		sketch.resize();
	};

	//temp function, TODO
	sketch.testXML = function() {
		let text = xml.getChildren()[0].DOM.textContent;
		document.getElementById("art").innerHTML = "<pre>"+text+"</pre>";
	}

	sketch.draw = function() {
		sketch.background(255);
		sketch.displayTiles();
	};

	sketch.displayTiles = function() {
		for (let x = 0; x < game.tileMap.width; x++) {
		  	for (let y = 0; y < game.tileMap.height; y++) {

		  		let tile = game.tileMap.tiles[x][y];
				sketch.setColor(tile);
				sketch.fill(tile.getTopColor());
				// if (game.selected.includes(tile)) {
				// 	sketch.stroke(0);
				// } else {
		  		sketch.noStroke();
		  // 		}
		  		sketch.rectMode(sketch.CENTER);
		  		sketch.rect(marginX + x*padding, marginY + y*padding, padding, padding, 5); 

		  		
		  		
		  		
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
		  			sketch.showEntities(tile);
		  		}
		  		
		  		sketch.noStroke();
		  		// sketch.textFont(customFont);
		  		sketch.textFont("Courier");
		  		sketch.textAlign(sketch.CENTER, sketch.CENTER);
		  		sketch.text(tile.getTopLetter().toUpperCase(), marginX + x*padding, marginY + y*padding);
		  	}
		}
	};

	sketch.showEntities = function(tile) {
		if (tile.entities.length > 1) {
			sketch.textStyle(sketch.BOLD);
		} else {
			sketch.textStyle(sketch.NORMAL);
		}
	};

	sketch.setColor = function(tile) {
		if (game.selected.includes(tile)) {
			tile.addColor(COLORS.selected);
		} else if (tile.entities.includes(game.player)) {
			tile.addColor(COLORS.player);
			if (tile.entities.length > 2) {
				sketch.testXML();
				//this doesnt belong here, TODO
				document.getElementById("entity-menu").style.visibility = "visible";
			}
		} else {
			tile.addColor(COLORS.empty);
			// document.getElementById("entity-menu").style.visibility = "hidden";
		}
	};

	sketch.keyPressed = function() {
		if (sketch.keyCode === sketch.ENTER) {
			game.move(game.player, game.selected);
		}
		console.log(sketch.keyCode);
		if (sketch.keyCode === 66) { //keyCode 66 = "b"
			bolded = !bolded;
		}
	};

	sketch.mouseDragged = function() {
		let mouseX = sketch.mouseX;
		let mouseY = sketch.mouseY;
		if (mouseX >= marginX - padding && mouseX <= marginX + (game.tileMap.width + 1)*padding &&
				mouseY >= marginY - padding && mouseY <= marginY + (game.tileMap.height + 1)*padding) {
			let x = Math.round(sketch.map(mouseX, marginX, marginX + (game.tileMap.width + 1)*padding, 0, game.tileMap.width + 1));
			let y = Math.round(sketch.map(mouseY, marginY, marginY + (game.tileMap.height + 1)*padding, 0, game.tileMap.height + 1));
			
			let tile = game.tileMap.tiles[x][y];
			if (!game.selected.includes(tile)) {
				game.selected.push(tile);
			}
		}
	}

	sketch.mousePressed = function() {
		let mouseX = sketch.mouseX;
		let mouseY = sketch.mouseY;
		if (mouseX >= marginX - padding && mouseX <= marginX + (game.tileMap.width + 1)*padding &&
				mouseY >= marginY - padding && mouseY <= marginY + (game.tileMap.height + 1)*padding) {
			let x = Math.round(sketch.map(mouseX, marginX, marginX + (game.tileMap.width + 1)*padding, 0, game.tileMap.width + 1));
			let y = Math.round(sketch.map(mouseY, marginY, marginY + (game.tileMap.height + 1)*padding, 0, game.tileMap.height + 1));
			
			let tile = game.tileMap.tiles[x][y];
			if (!game.selected.includes(tile)) {
				game.selected.push(tile);
			} else {
				let index = game.selected.indexOf(tile);
				game.selected.splice(index, 1);
			}
		}
	}

	sketch.resize = function() {
		sketch.resizeCanvas(game.tileMap.width*padding + marginX, game.tileMap.height*padding + marginY);
	};

};

let wordSearch = new p5(s);
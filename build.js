/// <reference path="../_references.ts" />
class Tile {
    constructor() {
        this._entities = [];
        this._letters = [];
    }
    get letters() {
        return this._letters;
    }
    set letters(letters) {
        this._letters = letters;
    }
    addLetter(letter) {
        this._letters.push(letter);
    }
    removeLetter(letter) {
        let index = this._letters.indexOf(letter);
        this._letters.splice(index, 1);
    }
    getTopLetter() {
        return this._letters[this._letters.length - 1];
    }
    get entities() {
        return this._entities;
    }
    set entities(entities) {
        this._entities = entities;
    }
    addEntity(entity) {
        this._entities.push(entity);
    }
    removeEntity(entity) {
        let index = this._entities.indexOf(entity);
        this._entities.splice(index, 1);
    }
}
/// <reference path="../_references.ts" />
class TileMap {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._entities = [];
        this._tiles = new Array(this._width);
        for (let x = 0; x < this._width; x++) {
            this._tiles[x] = new Array(this._height);
            for (let y = 0; y < this._height; y++) {
                let entity = new Ground();
                entity.location.push([x, y]);
                this._tiles[x][y] = new Tile();
                this._tiles[x][y].addLetter(entity.name);
                this._tiles[x][y].addEntity(entity);
                this._entities.push(entity);
            }
        }
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get tiles() {
        return this._tiles;
    }
    get entities() {
        return this._entities;
    }
    randomPosDir() {
        let x = Math.floor(Math.random() * this._width), y = Math.floor(Math.random() * this._height);
        let directions = [-1, 0, 1];
        let xStep = directions[Math.floor((Math.random() * 3))];
        if (xStep == 0) {
            directions = [-1, 1];
        }
        let yStep = directions[Math.floor((Math.random() * 3))];
        return [x, y, xStep, yStep];
    }
    insertEntities(entities) {
        for (let i = 0; i < entities.length; i++) {
            this.insertEntity(entities[i]);
        }
    }
    insertEntity(entity) {
        let posDir = this.randomPosDir();
        let x = posDir[0], y = posDir[1], xStep = posDir[2], yStep = posDir[3];
        let path = [];
        let i;
        //Does entity name fit?
        for (i = 0; i < entity.name.length; i++) {
            if (x < this.width && x > 0 && y < this.height && y > 0) {
                let tile = this._tiles[x][y];
                if (tile.entities.length == 1 ||
                    tile.getTopLetter() == entity.name.charAt(i)) {
                    tile.addLetter(entity.name.charAt(i));
                    path.push([x, y]);
                    x += xStep;
                    y += yStep;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        //If so, add entity to tile.
        if (i == entity.name.length) {
            entity.location = [];
            for (let location of path) {
                entity.location.push(location);
                let x = location[0];
                let y = location[1];
                this._tiles[x][y].addEntity(entity);
            }
            this._entities.push(entity);
            return true;
        }
        else {
            return this.insertEntity(entity);
        }
    }
    getTileLocation(tile) {
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                if (this._tiles[x][y] == tile) {
                    return [x, y];
                }
            }
        }
    }
    getEntityTiles(entity) {
        let entityTiles = new Array();
        for (let i = 0; i < entity.location.length; i++) {
            let x = entity.location[i][0];
            let y = entity.location[i][1];
            entityTiles.push(this._tiles[x][y]);
        }
        return entityTiles;
    }
}
/// <reference path="../_references.ts" />
class Entity {
    constructor(name) {
        this._name = name;
        this._location = [];
        this._active = false;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get location() {
        return this._location;
    }
    set location(location) {
        this._location = location;
    }
    get active() {
        return this._active;
    }
    set active(active) {
        this._active = active;
    }
}
/// <reference path="../_references.ts" />
class Ground extends Entity {
    constructor() {
        let randomLetter = Ground.alphabet[Math.floor(Math.random() * Ground.alphabet.length)];
        console.log(randomLetter);
        super(randomLetter);
    }
    playerCollision() {
        this.name = " ";
    }
}
Ground.alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
/// <reference path="../_references.ts" />
class Character extends Entity {
    constructor(name) {
        super(name);
        this._inventory = [];
    }
    attack(enemy) {
        enemy._health -= this._attackDamage;
    }
    addItem(item) {
        this._inventory.push(item);
    }
    die() { }
    playerCollision() {
        while (this._health > 0 && game.player.health > 0) {
            game.player.attack(this);
            this.attack(game.player);
            console.log("enemy battled");
        }
        if (game.player.health == 0) {
            game.player.die();
        }
    }
    get inventory() {
        return this._inventory;
    }
    get health() {
        return this._health;
    }
    set health(health) {
        this._health = health;
    }
    get attackDamage() {
        return this._attackDamage;
    }
    set attackDamage(attackDamage) {
        this._attackDamage;
    }
}
/// <reference path="../_references.ts" />
class Player extends Character {
    constructor(name) {
        super(name);
        super._health = 10;
        super._attackDamage = 1;
        super._active = true;
        this._party = [];
    }
    // die(): void {
    // 	this.name = "DEAD";
    // }
    playerCollision() { }
}
/// <reference path="../_references.ts" />
class Goblin extends Character {
    constructor() {
        super("Goblin");
        super._health = 6;
        super._attackDamage = 2;
    }
}
/// <reference path="../_references.ts" />
class Item extends Entity {
    constructor(name) {
        super(name);
    }
    playerCollision() {
        if (!game.player.inventory.includes(this)) {
            game.player.addItem(this);
            console.log(this.name + " added to inventory!");
        }
    }
}
/// <reference path="../_references.ts" />
class Door extends Entity {
    constructor() {
        super("Door");
    }
    playerCollision() {
        for (let item of game.player.inventory) {
            if (item.name == "Key") {
                game.newLevel();
            }
        }
    }
}
/// <reference path="../_references.ts" />
class Key extends Item {
    constructor() {
        super("Key");
    }
}
/// <reference path="./controller/Game.ts" />
/// <reference path="./controller/Tile.ts" />
/// <reference path="./controller/TileMap.ts" />
/// <reference path="./model/Entity.ts" />
/// <reference path="./model/Ground.ts" />
/// <reference path="./model/Character.ts" />
/// <reference path="./model/Player.ts" />
/// <reference path="./model/Goblin.ts" />
/// <reference path="./model/Item.ts" />
/// <reference path="./model/Door.ts" />
/// <reference path="./model/Key.ts" />
/// <reference path="../_references.ts" />
class Game {
    constructor() {
        this.checkPlayerCollision = function (tile) {
            if (tile.entities.includes(game.player) && tile.entities.length > 2) {
                this._colliding = tile.entities;
                for (let entity of this._colliding) {
                    entity.playerCollision();
                }
            }
        };
        this._selected = [];
        //createWorld
        this._tileMap = new TileMap(15, 15);
        //createEntities
        this._player = new Player("Hero");
        this._tileMap.insertEntities([this._player, new Door(), new Key(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin()]);
        this._colliding = [];
    }
    get colliding() {
        return this._colliding;
    }
    get tileMap() {
        return this._tileMap;
    }
    newLevel() {
        let level = new TileMap(15, 15);
        level.insertEntities([this._player, new Door(), new Key(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin()]);
        this._tileMap = level;
    }
    get player() {
        return this._player;
    }
    get selected() {
        return this._selected;
    }
    set selected(tiles) {
        this._selected = tiles;
    }
    move(entity, newLocation) {
        //check length of intended location
        if (entity.name.length != newLocation.length) {
            return false;
        }
        //check if location contains at least one instance of entity
        let i;
        for (i = newLocation.length - 1; i >= 0; i--) {
            if (newLocation[i].entities.includes(entity)) {
                break;
            }
        }
        if (i == -1) {
            return false;
        }
        //check if selected is in a line
        let xdiff = Math.abs(this._tileMap.getTileLocation(newLocation[0])[0] - this._tileMap.getTileLocation(newLocation[newLocation.length - 1])[0]);
        let ydiff = Math.abs(this._tileMap.getTileLocation(newLocation[0])[1] - this._tileMap.getTileLocation(newLocation[newLocation.length - 1])[1]);
        if ((ydiff != 3 && ydiff != 0) || (xdiff != 3 && xdiff != 0)) {
            return false;
        }
        //if all conditions were met, move to new location
        let oldLocation = this._tileMap.getEntityTiles(entity);
        for (let i = 0; i < newLocation.length; i++) {
            oldLocation[i].removeEntity(entity);
            let oldLetter = oldLocation[i].getTopLetter();
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
/// <reference path="../_references.ts" />
class Rat extends Character {
    constructor() {
        super("Rat");
        super._health = 1;
        super._attackDamage = 2;
    }
}
class EntityMenu {
    constructor() {
        this.element = document.getElementById("entity-menu");
    }
    getData() {
        if (game.colliding.length > 0) {
            let name = game.colliding[game.colliding.length - 2].name.toLowerCase();
            return xml.getChild(name);
        }
        return null;
    }
    setArt(data) {
        let artContainer = document.getElementById("entity-art");
        let art = data.getChild("art").DOM.textContent;
        artContainer.innerHTML = "<pre>" + art + "</pre>";
    }
    setInfo(data) {
        let infoContainer = document.getElementById("entity-info");
        let entity = game.colliding[game.colliding.length - 2];
        let info = entity.name;
        infoContainer.innerHTML = "<p>" + info + "</p>";
    }
    //pulling from xml over and over is bad for performance, TODO
    update() {
        let data = this.getData();
        if (data != null) {
            this.setArt(data);
            this.setInfo(data);
        }
    }
}
class PlayerMenu {
    constructor() {
        this.element = document.getElementById("player-menu");
        this.setArt();
    }
    setArt() {
        let artContainer = document.getElementById("player-art");
        let art = xml.getChild("player").getChild("art").DOM.textContent;
        artContainer.innerHTML = "<pre>" + art + "</pre>";
    }
    setInfo() {
        let infoContainer = document.getElementById("player-info");
        let info = game.player.name + ", Health: " + game.player.health + ", Attack: " + game.player.attackDamage;
        infoContainer.innerHTML = "<p>" + info + "</p>";
    }
    update() {
        this.setArt();
        this.setInfo();
    }
}
/// <reference path="../_references.ts" />
let game;
let xml;
let playerMenu;
let entityMenu;
let seed = function (sketch) {
    let font;
    let padding;
    let marginY, marginX;
    let COLORS;
    let bolded;
    // Runs first.
    sketch.preload = function () {
        // customFont = sketch.loadFont("./assets/fonts/fsex300-webfont.ttf");
        xml = sketch.loadXML('./assets/game-entities.xml');
        game = new Game();
    };
    // Runs once after preload().
    sketch.setup = function () {
        playerMenu = new PlayerMenu();
        entityMenu = new EntityMenu();
        let canvas = sketch.createCanvas(1000, 1000);
        canvas.parent('word-search');
        padding = 30;
        marginY = 10;
        marginX = 10;
        bolded = false;
        COLORS = {
            player: sketch.color(0, 0, 0),
            selected: sketch.color(160, 160, 160),
            active: sketch.color(120, 0, 120),
            empty: sketch.color(255, 255, 255),
        };
        sketch.resize();
    };
    //main loop of the application
    sketch.draw = function () {
        playerMenu.update();
        entityMenu.update();
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
    sketch.displayTile = function (tile, x, y) {
        let offset = sketch.offsetMap(x, y);
        let xOff = offset[0];
        let yOff = offset[1];
        sketch.setRectStyle(tile);
        sketch.rect(marginX + x * padding + xOff, marginY + y * padding + yOff, padding, padding, 5); //5 is the roundess/radius of the corners
        sketch.setTextStyle(tile);
        sketch.text(tile.getTopLetter().toUpperCase(), marginX + x * padding + xOff, marginY + y * padding + yOff);
    };
    sketch.offsetMap = function (x, y) {
        let theta = (sketch.frameCount + x + y) / 10;
        let coord = [Math.cos(theta) * 5, Math.sin(theta) * 5];
        //uncomment to animate
        // return coord; 
        return [0, 0];
    };
    sketch.showEntities = function (tile) {
        if (tile.entities.length > 1) {
            sketch.textStyle(sketch.BOLD);
        }
        else {
            sketch.textStyle(sketch.NORMAL);
        }
    };
    sketch.setTextStyle = function (tile) {
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
        }
        else {
            sketch.fill(0);
            sketch.textStyle(sketch.NORMAL);
        }
        if (bolded) {
            sketch.showAllEntities(tile);
        }
    };
    sketch.setRectStyle = function (tile) {
        sketch.rectMode(sketch.CENTER);
        sketch.noStroke();
        if (game.selected.includes(tile)) {
            sketch.fill(COLORS.selected);
        }
        else if (tile.entities.includes(game.player)) {
            sketch.fill(COLORS.player);
        }
        else {
            sketch.fill(COLORS.empty);
        }
    };
    sketch.showAllEntities = function (tile) {
        if (tile.entities.length > 1) {
            sketch.textStyle(sketch.BOLD);
        }
        else {
            sketch.textStyle(sketch.NORMAL);
        }
    };
    sketch.keyPressed = function () {
        if (sketch.keyCode === sketch.ENTER) {
            game.move(game.player, game.selected);
        }
        if (sketch.keyCode === 66) { //keyCode 66 = "b"
            bolded = !bolded;
        }
    };
    sketch.screenCoordToTile = function (screenX, screenY) {
        let coord = sketch.screenCoordSubmapper(screenX, screenY);
        let offset = sketch.offsetMap(coord[0], coord[1]);
        screenX -= offset[0];
        screenY -= offset[1];
        return sketch.screenCoordSubmapper(screenX, screenY);
    };
    sketch.screenCoordSubmapper = function (screenX, screenY) {
        let x = Math.round(sketch.map(screenX, marginX, marginX + (game.tileMap.width + 1) * padding, 0, game.tileMap.width + 1));
        let y = Math.round(sketch.map(screenY, marginY, marginY + (game.tileMap.height + 1) * padding, 0, game.tileMap.height + 1));
        return [x, y];
    };
    sketch.mouseDragged = function () {
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
    };
    // Repeat of mouseDragged, but for individual presses.
    sketch.mousePressed = function () {
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
            else {
                let index = game.selected.indexOf(tile);
                game.selected.splice(index, 1);
            }
        }
    };
    // Resizes canvas to match wordsearch length.
    sketch.resize = function () {
        sketch.resizeCanvas(game.tileMap.width * padding + marginX, game.tileMap.height * padding + marginY);
    };
};
let main = new p5(seed);

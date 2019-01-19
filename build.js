/// <reference path="../_references.ts" />
class Tile {
    constructor() {
        this._entities = [];
        this._letters = [];
        this._colors = [];
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
    get colors() {
        return this._colors;
    }
    set colors(colors) {
        this._colors = colors;
    }
    addColor(color) {
        this._colors.push(color);
    }
    removeColor(color) {
        let index = this._colors.indexOf(color);
        this._colors.splice(index, 1);
    }
    getTopColor() {
        return this._colors[this._colors.length - 1];
    }
}
/// <reference path="../_references.ts" />
//rect only
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
    //game has a list of ALL ENTITIES. Each entitity has a set of xy locations. Iterate over list of entities, placing each letter to respective bucket. 
    //make an update loop function that does this, reset each bucket to empty at start of loop.
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
}
Ground.alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
/// <reference path="../_references.ts" />
class Character extends Entity {
    constructor(name) {
        super(name);
    }
    attack(enemy) {
        enemy._health -= this._attackDamage;
    }
    addItem(item) {
        this._inventory.push(item);
    }
}
/// <reference path="../_references.ts" />
class Player extends Character {
    constructor(name) {
        super(name);
        super._health = 10;
        super._attackDamage = 1;
        super._active = true;
    }
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
}
/// <reference path="../_references.ts" />
class Door extends Item {
    constructor() {
        super("Door");
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
        this._selected = [];
        //createWorld
        this._tileMap = new TileMap(15, 15);
        //createEntities
        this._player = new Player("Hero");
        this._tileMap.insertEntities([this._player, new Door(), new Key(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin(), new Goblin()]);
    }
    get tileMap() {
        return this._tileMap;
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
            let oldColor = oldLocation[i].getTopColor();
            oldLocation[i].removeColor(oldColor);
            newLocation[i].addEntity(entity);
            newLocation[i].addLetter(oldLetter);
            newLocation[i].addColor(oldColor);
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
    createCanvas(1000, 1000);
    padding = 30;
    marginY = 50;
    marginX = 10;
    COLORS = {
        player: color(156, 218, 237),
        selected: color(239, 255, 177),
        active: color(120, 120, 120),
        empty: color(255, 255, 255),
    };
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
            rect(marginX + x * padding, marginY + y * padding, padding, padding, 5);
            //uncomment below to bold all entities in maze
            // showEntities(tile);
            if (tile.getTopLetter() == null) {
                tile.addLetter(" ");
            }
            fill(0);
            // textFont("Courier");
            textFont("Comic Sans");
            textAlign(CENTER, CENTER);
            text(tile.getTopLetter().toUpperCase(), marginX + x * padding, marginY + y * padding);
        }
    }
}
function showEntities(tile) {
    if (tile.entities.length > 1) {
        textStyle(BOLD);
    }
    else {
        textStyle(NORMAL);
    }
}
function setColor(tile) {
    if (game.selected.includes(tile)) {
        tile.addColor(COLORS.selected);
    }
    else if (tile.entities.includes(game.player)) {
        tile.addColor(COLORS.player);
        if (tile.entities.length > 2) {
            fill(0);
            textFont("Courier");
            textAlign(CENTER, CENTER);
            text("You found a " + tile.entities[1].name + "! " + "Health: " + tile.entities[1].health + ", Attack: " + tile.entities[1].attackDamage + "\n", 700, 50);
        }
    }
    else {
        tile.addColor(COLORS.empty);
    }
}
function keyPressed() {
    if (keyCode === ENTER) {
        game.move(game.player, game.selected);
    }
}
function mousePressed() {
    if (mouseX >= marginX - padding && mouseX <= marginX + (game.tileMap.width + 1) * padding &&
        mouseY >= marginY - padding && mouseY <= marginY + (game.tileMap.height + 1) * padding) {
        let x = Math.round(map(mouseX, marginX, marginX + (game.tileMap.width + 1) * padding, 0, game.tileMap.width + 1));
        let y = Math.round(map(mouseY, marginY, marginY + (game.tileMap.height + 1) * padding, 0, game.tileMap.height + 1));
        let tile = game.tileMap.tiles[x][y];
        if (!game.selected.includes(tile)) {
            game.selected.push(tile);
        }
        else {
            let index = game.selected.indexOf(tile);
            game.selected.splice(index, 1);
        }
    }
}

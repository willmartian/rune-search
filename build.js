/// <reference path="../_references.ts" />
class Game {
    constructor(o) {
        if (o) {
            this._selected = o.selected;
            this._tileMap = o.tileMap;
            this._player = o.player;
            this._entities = o.entities;
            this._colliding = o.colliding;
        }
        else {
            this._selected = [];
            //createWorld
            this._tileMap = new TileMap(30, 15);
            //createEntities
            this._player = new Player("Hero");
            this._entities = [
                this.player,
                new Door(),
                new items.Key,
                new enemies.Goblin,
                new enemies.Rat,
                new enemies.Robot,
                new enemies.Dragon,
                new enemies.Unicorn,
                new enemies.Zombie
            ];
            this._tileMap.insertEntities(this._entities);
            this._colliding = [];
        }
    }
    //Only adding one entity to colliding, TODO
    checkCollisions(entity) {
        let tiles = this._tileMap.getEntityTiles(entity);
        let colliding = [];
        for (let tile of tiles) {
            for (let otherEntity of tile.entities) {
                if (!colliding.includes(otherEntity) && entity !== otherEntity) { //&& otherEntity.constructor.name !== "Ground") {
                    colliding.push(otherEntity);
                    otherEntity.playerCollision();
                }
            }
        }
        this._colliding = colliding;
    }
    get colliding() {
        return this._colliding;
    }
    get tileMap() {
        return this._tileMap;
    }
    newLevel() {
        let level = new TileMap(35, 20);
        level.insertEntities(this._entities);
        this._colliding = [];
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
    updatePlayerMana(tiles) {
        for (let tile of tiles) {
            let vowels = tile.getVowels();
            for (let vowel of vowels) {
                game.player.mana.increase(vowel, 1);
            }
        }
        //temporary hacky solution: removes the e and o added from "HERO". TODO
        game.player.mana.decrease("e", 1);
        game.player.mana.decrease("o", 1);
        console.log(game.player.mana.toString());
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
            let index = oldLocation[i].entityIndex(entity);
            oldLocation[i].removeEntity(entity);
            oldLocation[i].removeLetterAtIndex(index);
            newLocation[i].addEntity(entity);
            newLocation[i].addLetter(entity.name.charAt(i));
        }
        let curLocation = [];
        for (let i = 0; i < newLocation.length; i++) {
            curLocation.push(this._tileMap.getTileLocation(newLocation[i]));
        }
        entity.location = curLocation;
        this._selected = [];
        if (entity == this._player) {
            this.updatePlayerMana(newLocation);
        }
        return true;
    }
    headshift(entity, mul) {
        let newHead = entity.head;
        newHead[0] += mul * entity.dir[0];
        newHead[1] += mul * entity.dir[1];
        let line = this._tileMap.getTiles(this._tileMap.line(newHead, entity.dir, entity.length));
        if (line.indexOf(null) == -1 && game.move(entity, line)) {
            entity.head = newHead;
            return true;
        }
        else {
            return false;
        }
    }
    changeDir(entity, dir) {
        let line = this._tileMap.getTiles(this._tileMap.line(entity.head, dir, entity.length));
        if (line.indexOf(null) == -1 && game.move(entity, line)) {
            entity.dir = dir;
            return true;
        }
        else {
            return false;
        }
    }
    rotateDir(entity, clockwise) {
        let newdir = this._tileMap.rotateDir(entity.dir, clockwise);
        return this.changeDir(entity, newdir);
    }
    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj = Object.assign({}, this);
        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
            if (descriptor && key[0] !== '_') {
                try {
                    const val = this[key];
                    jsonObj[key] = val;
                }
                catch (error) {
                    console.error(`Error calling getter ${key}`, error);
                }
            }
        });
        return jsonObj;
    }
}
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
    removeLetterAtIndex(index) {
        this._letters.splice(index, 1);
    }
    removeTopLetter() {
        this._letters.pop();
    }
    changeLetter(index, newLetter) {
        this._letters[index] = newLetter;
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
    containsEntity(entity) {
        return this._entities.indexOf(entity) != -1;
    }
    removeEntity(entity) {
        for (let i = 0; i < this._entities.length; i++) {
            if (this._entities[i] == entity) {
                this._entities.splice(i, 1);
            }
        }
    }
    entityIndex(entity) {
        return this._entities.indexOf(entity);
    }
    getVowels() {
        let vowels = [];
        for (let letter of this._letters) {
            if ("aieou".includes(letter.toLowerCase())) {
                vowels.push(letter);
            }
        }
        return vowels;
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
        let yStep = directions[Math.floor((Math.random() * directions.length))];
        return [x, y, xStep, yStep];
    }
    rotateDir(dir, clockwise) {
        let cos45 = 0.70710678118;
        let sin45 = 0.70710678118;
        let x = dir[0];
        let y = dir[1];
        if (clockwise) {
            return [Math.round(x * cos45 + y * sin45), Math.round(y * cos45 - x * sin45)];
        }
        else {
            return [Math.round(x * cos45 - y * sin45), Math.round(x * sin45 + y * cos45)];
        }
    }
    insertEntities(entities) {
        for (let i = 0; i < entities.length; i++) {
            this.insertEntity(entities[i]);
        }
    }
    line(head, dir, length) {
        let locations = [];
        let x = head[0];
        let y = head[1];
        for (let i = 0; i < length; i++) {
            locations.push([x, y]);
            x += dir[0];
            y += dir[1];
        }
        return locations;
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
            let currLocation = [];
            for (let location of path) {
                currLocation.push(location);
                let x = location[0];
                let y = location[1];
                this._tiles[x][y].addEntity(entity);
            }
            entity.location = currLocation;
            this._entities.push(entity);
            return true;
        }
        else {
            for (let location of path) {
                let x = location[0];
                let y = location[1];
                this._tiles[x][y].removeTopLetter();
            }
            return this.insertEntity(entity);
        }
    }
    // removeEntity(entity: Entity): Entity {
    // 	//TODO
    // }
    getTileLocation(tile) {
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                if (this._tiles[x][y] == tile) {
                    return [x, y];
                }
            }
        }
    }
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            console.log("out of bounds....");
            return null;
        }
        return this._tiles[x][y];
    }
    getTiles(points) {
        let result = [];
        for (let i = 0; i < points.length; i++) {
            result.push(this.getTile(points[i][0], points[i][1]));
        }
        return result;
    }
    getEntityTiles(entity) {
        let entityTiles = new Array();
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                let curr = this.getTile(x, y);
                if (curr.containsEntity(entity)) {
                    entityTiles.push(curr);
                }
            }
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
    get length() {
        return this._name.length;
    }
    get location() {
        return this._location;
    }
    set location(location) {
        this._location = location;
        if (location.length < 2) {
            return;
        }
        this._head = location[0];
        this._dir = [location[1][0] - this._head[0], location[1][1] - this._head[1]];
    }
    locationIncludes(x, y) {
        for (let i = 0; i < this._location.length; i++) {
            if (this._location[i][0] == x && this._location[i][1] == y) {
                return true;
            }
        }
        return false;
    }
    get head() {
        return this._head;
    }
    set head(head) {
        this._head = head;
    }
    get tail() {
        return [this._head[0] + this.length * this._dir[0], this._head[1] + this.length * this._dir[1]];
    }
    get dir() {
        return this._dir;
    }
    set dir(dir) {
        this._dir = dir;
    }
    get reverseDir() {
        return [this._dir[0] * -1, this._dir[1] * -1];
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
        super(randomLetter);
    }
    playerCollision() {
        // this.name = " ";
        // let tile = game.tileMap.tiles[this.location[0][0]][this.location[0][1]];
        // tile.changeLetter(tile.letters.length-2, this.name);
    }
}
//private static readonly alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split('');
Ground.alphabet = "bcdfghjklmnpqrstvwxyz".split('');
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
    //TODO
    die() { }
    playerCollision() {
        while (this.isAlive() && game.player.isAlive()) {
            game.player.attack(this);
            this.attack(game.player);
            console.log("enemy battled");
        }
        if (game.player.isDead()) {
            game.player.die();
        }
    }
    isDead() {
        return !(this._health > 0);
    }
    isAlive() {
        return (this._health > 0);
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
    inventoryToString() {
        let s = "Inventory: ";
        if (this._inventory.length > 0) {
            s += this._inventory[0].name;
            for (let i = 1; i < this._inventory.length; i++) {
                s += ", " + this._inventory[i].name;
            }
        }
        return s;
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
        this._mana = new Manager("aaaaa");
        this._skills = [skills.slap];
    }
    get mana() {
        return this._mana;
    }
    get skills() {
        return this._skills;
    }
    giveSkill(s) {
        if (this._skills.indexOf(s) == -1) {
            this._skills.push(s);
        }
    }
    revokeSkill(n) {
        let s = skills[n];
        let index = this._skills.indexOf(s);
        if (index != -1) {
            this._skills.splice(index, 1);
        }
    }
    playerCollision() { }
}
/// <reference path="../_references.ts" />
let enemies = {
    Dragon: class extends Character {
        constructor() {
            super("Dragon");
            super._health = 6;
            super._attackDamage = 2;
        }
    },
    Goblin: class extends Character {
        constructor() {
            super("Goblin");
            super._health = 6;
            super._attackDamage = 2;
        }
    },
    Rat: class extends Character {
        constructor() {
            super("Rat");
            super._health = 1;
            super._attackDamage = 2;
        }
    },
    Robot: class extends Character {
        constructor() {
            super("Robot");
            super._health = 1;
            super._attackDamage = 2;
        }
    },
    Unicorn: class extends Character {
        constructor() {
            super("Unicorn");
            super._health = 6;
            super._attackDamage = 2;
        }
    },
    Zombie: class extends Character {
        constructor() {
            super("Zombie");
            super._health = 6;
            super._attackDamage = 2;
        }
    }
};
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
                //remove key from inventory, TODO
                game.newLevel();
            }
        }
    }
}
/// <reference path="../_references.ts" />
let items = {
    Key: class extends Item {
        constructor() {
            super("Key");
        }
    }
};
/// <reference path="./controller/Game.ts" />
/// <reference path="./controller/Tile.ts" />
/// <reference path="./controller/TileMap.ts" />
/// <reference path="./model/Entity.ts" />
/// <reference path="./model/Ground.ts" />
/// <reference path="./model/Character.ts" />
/// <reference path="./model/Player.ts" />
/// <reference path="./model/enemies.ts" />
/// <reference path="./model/Item.ts" />
/// <reference path="./model/Door.ts" />
/// <reference path="./model/items.ts" />
/// <reference path="../_references.ts" />
class Battle {
    constructor(health, enemyName, countdown) {
        this._startingHealth = health;
        this._health = health;
        this._enemyName = enemyName;
        this._countdown = countdown;
        this._skillQueue = new Array();
        this._player = game.player;
        this._log = new Array();
    }
    get countdown() {
        return this._countdown;
    }
    get skillQueue() {
        return this._skillQueue;
    }
    get enemyName() {
        return this._enemyName;
    }
    get log() {
        return this._log;
    }
    get totalCost() {
        let result = new Manager();
        for (let i = 0; i < this._skillQueue.length; i++) {
            result.add(this._skillQueue[i].cost);
        }
        return result;
    }
    get player() {
        return this._player;
    }
    get statuses() {
        return this._statuses;
    }
    addStatus(status) {
        for (let i = 0; i < this._statuses.length; i++) {
            if (this._statuses[i].kind == status.kind) {
                this._statuses[i].increment(status.countdown);
                return;
            }
        }
        this._statuses.push(status);
    }
    changeCountdown(x) {
        this._countdown += x;
    }
    enqueue(s) {
        this._skillQueue.push(s);
    }
    logText(s) {
        this._log.push(s);
    }
    clearQueue() {
        this._skillQueue = new Array();
    }
    endTurn() {
        for (let i = 0; i < this._skillQueue.length; i++) {
            this._skillQueue[i].execute(this);
        }
        this._player.mana.subtract(this.totalCost);
        this._skillQueue = [];
        this.runStatusCallbacks("turnEnd");
        if (this._health <= 0) {
            this.victory();
            return;
        }
        this._countdown--;
        if (this.countdown == 0) {
            this.gameover();
        }
    }
    damage(x) {
        this._health -= x;
        this.runStatusCallbacks("attack");
    }
    heal(x) {
        this._health += x;
        if (this._health > this._startingHealth) {
            this._health = this._startingHealth;
        }
    }
    spoils() {
        let result = new Manager(this._enemyName);
        let ratio = Math.abs(this._health) / this._startingHealth;
        ratio = Math.max(1, Math.floor(ratio));
        result.multiply(ratio);
        return result;
    }
    victory() {
        //TODO: more victory code goes here
        this._player.mana.add(this.spoils());
        console.log("battle won!");
    }
    gameover() {
        //TODO: game over code goes here
        console.log("battle lost :(");
    }
    runStatusCallbacks(callback) {
        for (let i = 0; i < this._statuses.length; i++) {
            this._statuses[i][callback](this);
        }
        let temp = [];
        for (let i = 0; i < this._statuses.length; i++) {
            if (this._statuses[i].countdown != 0) {
                temp.push(this._statuses[i]);
            }
        }
        this._statuses = temp;
    }
}
//creates a string ascii hp bar
class HpBar {
    constructor(max) {
        this.maxBar = 10; //max number of bars to represent hp in string
        this.currentHealth = max; //hp is full when bar is created
        this.maxHealth = max;
        this.barString = "██████████";
    }
    //update will update the currentHealth and reupdate the barString
    //update will take in cur which is the new current hp hpBar should be updated
    //with
    update(cur) {
        if (cur != this.currentHealth) {
            this.currentHealth = cur;
            var tmp = this.currentHealth * 10 / this.maxHealth;
            var i = 0;
            this.barString = "";
            //remaking barString
            while (i < this.maxBar) {
                if (i < tmp) {
                    var re = /░/;
                    this.barString = this.barString + "█";
                }
                else {
                    this.barString = this.barString + "░";
                }
                i = i + 1;
            }
        }
    }
    get bar() {
        return this.barString;
    }
}
/// <reference path="../_references.ts" />
class Manager {
    constructor(word = "") {
        this._a = 0;
        this._e = 0;
        this._i = 0;
        this._o = 0;
        this._u = 0;
        word = word.toLowerCase();
        for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (Manager.vowels.indexOf(char) != -1) {
                this.increase(char, 1);
            }
        }
    }
    get a() {
        return this._a;
    }
    set a(x) {
        this._a = x;
    }
    get e() {
        return this._e;
    }
    set e(x) {
        this._e = x;
    }
    get i() {
        return this._i;
    }
    set i(x) {
        this._i = x;
    }
    get o() {
        return this._o;
    }
    set o(x) {
        this._o = x;
    }
    get u() {
        return this._a;
    }
    set u(x) {
        this._u = x;
    }
    getAmount(which) {
        switch (which.toLowerCase()) {
            case "a":
                return this._a;
            case "e":
                return this._e;
            case "i":
                return this._i;
            case "o":
                return this._o;
            case "u":
                return this._u;
        }
    }
    setAmount(which, x) {
        switch (which.toLowerCase()) {
            case "a":
                this._a = x;
                break;
            case "e":
                this._e = x;
                break;
            case "i":
                this._i = x;
                break;
            case "o":
                this._o = x;
                break;
            case "u":
                this._u = x;
                break;
        }
    }
    increase(which, x) {
        switch (which.toLowerCase()) {
            case "a":
                this._a += x;
                break;
            case "e":
                this._e += x;
                break;
            case "i":
                this._i += x;
                break;
            case "o":
                this._o += x;
                break;
            case "u":
                this._u += x;
                break;
        }
    }
    decrease(which, x) {
        switch (which.toLowerCase()) {
            case "a":
                this._a -= x;
                break;
            case "e":
                this._e -= x;
                break;
            case "i":
                this._i -= x;
                break;
            case "o":
                this._o -= x;
                break;
            case "u":
                this._u -= x;
                break;
        }
    }
    add(other) {
        for (let letter in Manager.vowels) {
            this.increase(letter, other.getAmount(letter));
        }
    }
    subtract(other) {
        for (let letter in Manager.vowels) {
            this.decrease(letter, other.getAmount(letter));
        }
    }
    multiply(scalar) {
        scalar = Math.round(scalar);
        for (let letter in Manager.vowels) {
            this.setAmount(letter, this.getAmount(letter) * scalar);
        }
    }
    fitsInto(other) {
        for (let letter in Manager.vowels) {
            if (this.getAmount(letter) > other.getAmount(letter)) {
                return false;
            }
        }
        return true;
    }
    toString() {
        return "Mana Runes (A: " + this._a + ", " + "E: " + this._e + ", " + "I: " + this._i + ", " + "O: " + this._o + ", " + "U: " + this._u + ")";
    }
}
Manager.vowels = ["a", "e", "i", "o", "u"];
/// <reference path="../_references.ts" />
class Skill {
    constructor(name, desc, effect) {
        this._name = name;
        this._desc = desc;
        this._effect = effect;
        this._cost = new Manager(name);
    }
    get name() {
        return this._name;
    }
    get desc() {
        return this._name;
    }
    get cost() {
        return this._cost;
    }
    execute(b) {
        this._effect.call(undefined, b);
    }
    static makeDamageEffect(damageAmount) {
        return function (b) {
            b.damage(damageAmount);
        };
    }
    static makeCountdownEffect(countdownAmount) {
        return function (b) {
            b.changeCountdown(countdownAmount);
        };
    }
    static makeStatusEffect(status) {
        return function (b) {
            b.addStatus(status);
        };
    }
    static makeRepeatedEffect(effect, repetitions) {
        return function (b) {
            for (let i = 0; i < repetitions; i++) {
                effect.call(undefined, b);
            }
        };
    }
    static concatEffect(...effects) {
        return function (b) {
            for (let i = 0; i < effects.length; i++) {
                effects[i].call(undefined, b);
            }
        };
    }
    static revokeSkill(skillName) {
        return function (b) {
            b.player.revokeSkill(skillName);
        };
    }
}
Skill.vowels = ["a", "e", "i", "o", "u"];
/// <reference path="../_references.ts" />
class StatusEffect {
    constructor(n, d, c, k) {
        this._name = n;
        this._desc = d;
        this._countdown = c;
        this._kind = k;
        this._turnEndCallback = this.trivialFunction();
        this._attackCallback = this.trivialFunction();
    }
    get countdown() {
        return this._countdown;
    }
    get kind() {
        return this._kind;
    }
    get name() {
        return this._name;
    }
    get desc() {
        let temp = this._desc;
        temp = temp.replace("%countdown", this._countdown + "");
        return temp;
    }
    set turnEndCallback(f) {
        this._turnEndCallback = f;
    }
    set attackCallback(f) {
        this._attackCallback = f;
    }
    increment(x = 1) {
        this._countdown += x;
    }
    decrement(x = 1) {
        this._countdown -= x;
    }
    attack(b) {
        this._attackCallback.call(this, b);
    }
    turnEnd(b) {
        this._turnEndCallback.call(this, b);
    }
    trivialFunction() {
        return function () { };
    }
    static fragileStatus(countdown) {
        let status = new StatusEffect("Fragile", "Enemy takes %countdown extra damage from all attacks.", countdown, "fragile");
        status.attackCallback = function (b) {
            b.damage(this._countdown);
        };
        return status;
    }
    static poisonStatus(countdown) {
        let status = new StatusEffect("Poison", "Enemy takes %countdown damage this turn, then loses 1 Poison.", countdown, "poison");
        status.turnEndCallback = function (b) {
            b.damage(this._countdown);
            this._countdown--;
        };
        return status;
    }
    static regenStatus(countdown) {
        let status = new StatusEffect("Regen", "Enemy heals %countdown HP this turn, then loses 1 Regen.", countdown, "regen");
        status.turnEndCallback = function (b) {
            b.heal(this._countdown);
            this._countdown--;
        };
        return status;
    }
}
/// <reference path="../_references.ts" />
class UsableOnceSkill extends Skill {
    constructor(name, desc, effect) {
        super(name, desc, effect);
    }
    execute(b) {
        super.execute(b);
        b.player.revokeSkill(this.name.toLowerCase());
    }
}
/// <reference path="../_references.ts" />
let skills = {
    slap: new Skill("Slap", "Deal 2 damage.", Skill.makeDamageEffect(2)),
    disemvowel: new Skill("Disemvowel", "Deal 999 damage! (Useable only once.)", Skill.makeDamageEffect(999)),
    aegis: new UsableOnceSkill("Aegis of Divine Unmaking", //someone please give this a better name
    "Increase countdown by 5! (Usable once only.)", Skill.makeCountdownEffect(5)),
    acidify: new Skill("Acidify", "Inflict 1 Fragile.", Skill.makeStatusEffect(StatusEffect.fragileStatus(1))),
    venom: new Skill("Venom", "Inflict 2 poison.", Skill.makeStatusEffect(StatusEffect.poisonStatus(2))),
    fanTheHammer: new Skill("Fan the Hammer", "Do 1 damage 6 times.", Skill.makeRepeatedEffect(Skill.makeDamageEffect(1), 6)),
    poisonPen: new UsableOnceSkill("Poison Pen Diatribe", "Inflict 100 Poison. Usable once only.", Skill.makeStatusEffect(StatusEffect.poisonStatus(100))),
    demolitionCharge: new UsableOnceSkill("Demolition Charge", "Inflict 25 Fragile. Usable once only.", Skill.makeStatusEffect(StatusEffect.fragileStatus(25))),
};
// var skills = {};
// function addSkill(s: Skill): void {
// 	skills[s.name.toLowerCase()] = s;
// }
// function addSkills(...s: Skill[]): void {
// 	for (let i = 0; i < s.length; i++) {
// 		addSkill(s[i]);
// 	}
// }
// addSkills(
// 	new Skill(
// 		"Bash",
// 		"Deal 2 damage.",
// 		Skill.makeDamageEffect(2)
// 	),
// 	new UsableOnceSkill(
// 		"Disemvoweling Scourge",
// 		"Deal 999 damage. Usable once only.",
// 		Skill.makeDamageEffect(999)
// 	),
// 	new UsableOnceSkill(
// 		"Aegis of Divine Unmaking", //someone please give this a better name
// 		"Increase countdown by 5. Usable once only.",
// 		Skill.makeCountdownEffect(5)
// 	),
// );
class CollisionMenu {
    constructor() {
        this.element = document.getElementById("collision-menu");
        this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
    }
    //TODO: only showing the top entity of the last tile, pls fix
    getData() {
        let data;
        if (this.colliding.length > 0) {
            let name = this.colliding[this.colliding.length - 1].constructor.name.toLowerCase();
            data = xml.getChild(name);
            if (!data) {
                data = xml.getChild("default");
            }
            return data;
        }
        return null;
    }
    setArt(data) {
        let artContainer = document.getElementById("collision-art");
        if (data !== null) {
            let art = data.getChild("art").DOM.textContent;
            artContainer.innerHTML = "<pre>" + art + "</pre>";
        }
        else {
            artContainer.innerHTML = "";
        }
    }
    setName(data) {
        let nameContainer = document.getElementById("collision-name");
        if (data !== null) {
            let entity = this.colliding[this.colliding.length - 1];
            nameContainer.innerHTML = "<p>" + entity.name + "</p>";
        }
        else {
            nameContainer.innerHTML = "";
        }
    }
    setMoves() {
        let skills = game.player.skills;
        let skillList = document.getElementById("move-list").children[0];
        let children = skillList.childNodes;
        while (children[1]) {
            skillList.removeChild(children[1]);
        }
        for (let skill of skills) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(skill.name));
            skillList.appendChild(li);
        }
        if (skills.length == 0) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode("Empty :("));
            skillList.appendChild(li);
        }
    }
    display(data) {
        let ws = document.getElementById("word-search");
        if (data != null && showCM) {
            this.setArt(data);
            this.setName(data);
            this.setMoves();
            this.element.style.display = "inline";
            ws.style.display = "none";
        }
        else {
            this.element.style.display = "none";
            ws.style.display = "flex";
        }
    }
    //pulling from xml over and over is bad for performance, TODO
    update() {
        this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
        let data = this.getData();
        this.display(data);
    }
}
class PlayerMenu {
    constructor() {
        this.element = document.getElementById("player-menu");
        this.update();
    }
    getData() {
        let data;
        let name = game.player.name.toLowerCase();
        data = xml.getChild(name);
        if (!data) {
            data = xml.getChild("default");
        }
        return data;
    }
    setArt(data) {
        let artContainer = document.getElementById("player-art");
        let art = data.getChild("art").DOM.textContent;
        artContainer.innerHTML = "<pre>" + art + "</pre>";
    }
    setInfo() {
        this.setMana();
        this.setInventory();
    }
    setMana() {
        let mana = game.player.mana;
        document.getElementById("a-mana").innerHTML = mana.a;
        document.getElementById("e-mana").innerHTML = mana.e;
        document.getElementById("i-mana").innerHTML = mana.i;
        document.getElementById("o-mana").innerHTML = mana.o;
        document.getElementById("u-mana").innerHTML = mana.u;
    }
    setInventory() {
        let inventory = game.player.inventory;
        let inventoryList = document.getElementById("player-inventory-list");
        let children = inventoryList.childNodes;
        while (children[1]) {
            inventoryList.removeChild(children[1]);
        }
        for (let item of inventory) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(item.name));
            inventoryList.appendChild(li);
        }
        if (inventory.length == 0) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode("Empty :("));
            inventoryList.appendChild(li);
        }
    }
    update() {
        let data = this.getData();
        if (data != null) {
            this.setArt(data);
            this.setInfo(data);
        }
    }
}
/// <reference path="../_references.ts" />
let game;
let xml;
let playerMenu;
let collisionMenu;
let music;
let showCM;
let seed = function (sketch) {
    let font;
    let fontSize;
    let padding;
    let marginY, marginX;
    let COLORS;
    let showEntities;
    let showMana;
    let locationTest;
    // Runs first.
    sketch.preload = function () {
        // customFont = sketch.loadFont("./assets/fonts/Erika_Ormig.ttf");
        xml = sketch.loadXML('./assets/game-entities.xml');
        music = sketch.createAudio('assets/music/Exploratory_Final.mp3');
        game = new Game();
    };
    // Runs once after preload().
    sketch.setup = function () {
        music.loop();
        playerMenu = new PlayerMenu();
        collisionMenu = new CollisionMenu();
        let canvas = sketch.createCanvas(1000, 1000);
        sketch.noLoop();
        canvas.parent('word-search');
        // padding = 30;
        marginY = 10;
        marginX = 10;
        fontSize = window.getComputedStyle(document.body).fontSize;
        padding = parseInt(fontSize) * 2;
        console.log(padding);
        showEntities = true;
        showMana = false;
        showCM = true;
        locationTest = false;
        COLORS = {
            // player: sketch.color(0, 0, 0),
            player: sketch.color(255, 255, 255),
            selected: sketch.color(160, 160, 160),
            active: sketch.color(120, 0, 120),
            empty: sketch.color(255, 255, 255),
        };
        sketch.resize();
        sketch.translate(100, 100);
    };
    //main loop of the application
    sketch.draw = function () {
        // sketch.background(255);
        sketch.clear();
        game.checkCollisions(game.player);
        for (let x = 0; x < game.tileMap.width; x++) {
            for (let y = 0; y < game.tileMap.height; y++) {
                let tile = game.tileMap.tiles[x][y];
                sketch.displayTile(tile, x, y);
            }
        }
        collisionMenu.update();
        playerMenu.update();
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
        // return coord; //uncomment to animate
        return [0, 0];
    };
    // sketch.switchView = function() {
    // 	let cm = document.getElementById("collision-menu");
    // 	let ws = document.getElementById("word-search");
    // 	if (cm.style.display != "none" || cm.style.display == "") {
    // 		cm.style.display = "none";
    // 		ws.style.display = "flex";
    // 	} else if (ws.style.display != "none" || ws.style.display == "") {
    // 		ws.style.display = "none";
    // 		cm.style.display = "flex";
    // 	}
    // }
    sketch.setTextStyle = function (tile) {
        sketch.noStroke();
        sketch.textSize(parseInt(fontSize));
        // sketch.textFont(customFont);
        sketch.textFont("Courier");
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        if (tile.getTopLetter() == null) {
            tile.addLetter(" ");
        }
        if (tile.entities.includes(game.player)) {
            // sketch.fill(255);
            sketch.fill(0);
            sketch.textStyle(sketch.BOLD);
        }
        else {
            // sketch.fill(0);
            sketch.fill(255);
            sketch.textStyle(sketch.NORMAL);
        }
        // sketch.showColliding(tile);
        // if (showEntities) {
        // 	sketch.showAllEntities(tile);
        // } else if (showMana) {
        // 	sketch.showAllMana(tile);
        // }
    };
    sketch.setRectStyle = function (tile) {
        sketch.rectMode(sketch.CENTER);
        if (showEntities) {
            sketch.showAllEntities(tile);
        }
        if (game.selected.includes(tile)) {
            sketch.fill(COLORS.selected);
        }
        else if (tile.entities.includes(game.player)) {
            sketch.fill(COLORS.player);
            if (locationTest) {
                let loc = game.tileMap.getTileLocation(tile);
                if (game.player.locationIncludes(loc[0], loc[1])) {
                    sketch.stroke(sketch.color(0, 255, 255));
                }
            }
        }
        else {
            // sketch.fill(COLORS.empty);
            sketch.noFill();
        }
    };
    sketch.showColliding = function (tile) {
        for (let entity of tile.entities) {
            if (game.colliding.includes(entity)) {
                sketch.textStyle(sketch.BOLD);
                return;
            }
        }
        sketch.textStyle(sketch.NORMAL);
    };
    sketch.showAllEntities = function (tile) {
        if (tile.entities.length > 1) {
            // sketch.textStyle(sketch.BOLD);
            sketch.stroke(255);
        }
        else {
            // sketch.textStyle(sketch.NORMAL);
            sketch.noStroke();
        }
    };
    sketch.showAllMana = function (tile) {
        if (tile.getVowels().length > 0) {
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
        if (sketch.key == "e") {
            showEntities = !showEntities;
        }
        else if (sketch.key == "v") {
            showMana = !showMana;
        }
        else if (sketch.key == "s") {
            // sketch.switchView();
            showCM = !showCM;
        }
        else if (sketch.key == "z") {
            // sketch.switchView();
            sketch.saveGame();
        }
        else if (sketch.key == "x") {
            // sketch.switchView();
            sketch.loadGame();
        }
        else if (sketch.key == "l") { //keyCode 74 = "l"
            locationTest = !locationTest;
        }
        else if (sketch.keyCode === 38) { //down arrow
            game.headshift(game.player, -1);
        }
        else if (sketch.keyCode === 40) { //up arrow
            game.headshift(game.player, 1);
        }
        else if (sketch.keyCode == 37) { //left arrow
            game.rotateDir(game.player, true);
        }
        else if (sketch.keyCode == 39) { //right arrow
            game.rotateDir(game.player, false);
        }
        sketch.draw();
        return false;
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
        sketch.draw();
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
        sketch.draw();
    };
    // Resizes canvas to match wordsearch length.
    sketch.resize = function () {
        sketch.resizeCanvas(game.tileMap.width * padding + marginX, game.tileMap.height * padding + marginY);
    };
    //TODO
    sketch.saveGame = function () {
        let saveState = JSON.stringify(game.toJSON());
        localStorage.setItem("saveState", saveState);
    };
    //TODO
    sketch.loadGame = function () {
        // try {
        let gameSeed = JSON.parse(localStorage.getItem("saveState"));
        let game = new Game(gameSeed);
        // } catch(err) {
        // 	console.log(err);
        // }
    };
};
let main = new p5(seed);

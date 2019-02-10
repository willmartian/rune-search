/// <reference path="../_references.ts" />

class Battle {

	protected _countdown: number;
	protected _startingHealth: number;
	protected _health: number;
	protected _skillQueue: Skill[];
	protected _enemyName: String;

	constructor(health: number, enemyName: String, countdown: number) {
		this._startingHealth = health;
		this._health = health;
		this._enemyName = enemyName;
		this._countdown = countdown;
		this._skillQueue = new Array<Skill>();
	}

	get countdown(): number {
		return this._countdown;
	}

	get skillQueue(): Array<Skill> {
		return this._skillQueue;
	}

	get enemyName(): String {
		return this._enemyName;
	}

	get totalCost(): Manager {
		let result = new Manager();
		for (let i = 0; i < this._skillQueue.length; i++) {
			result.add(this._skillQueue[i].cost);
		}
		return result;
	}

	endTurn(): void {
		for (let i = 0; i < this._skillQueue.length; i++) {
			this._skillQueue[i].execute(this);
		}
		this._skillQueue = [];
		this._countdown--;
		if (this.countdown == 0) {
			this.gameover();
		}
	}

	damage(x: number): void {
		this._health -= x;
		if (this._health <= 0) {
			this.victory();
		}
	}

	spoils(): Manager {
		let result = new Manager(this._enemyName);
		let ratio = Math.abs(this._health)/this._startingHealth;
		ratio = Math.max(1, Math.floor(ratio));
		result.multiply(ratio);
		return result;
	}

	victory(): void {
		//victory code goes here
		console.log("battle won!");
	}

	gameover(): void {
		//game over code goes here
		console.log("battle lost :(");
	}

}
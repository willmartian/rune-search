/// <reference path="../_references.ts" />

class Battle {

	protected _countdown: number;
	protected _startingHealth: number;
	protected _health: number;
	protected _skillQueue: Skill[];
	protected _enemyName: string;
	protected _player: Player;
	protected _log: string[];
	protected _statuses: StatusEffect[];

	constructor(health: number, enemyName: string, countdown: number) {
		this._startingHealth = health;
		this._health = health;
		this._enemyName = enemyName;
		this._countdown = countdown;
		this._skillQueue = new Array<Skill>();
		this._player = game.player;
		this._log = new Array<string>();
	}

	get countdown(): number {
		return this._countdown;
	}

	get skillQueue(): Array<Skill> {
		return this._skillQueue;
	}

	get enemyName(): string {
		return this._enemyName;
	}

	get log(): string[] {
		return this._log;
	}

	get totalCost(): Manager {
		let result = new Manager();
		for (let i = 0; i < this._skillQueue.length; i++) {
			result.add(this._skillQueue[i].cost);
		}
		return result;
	}

	get player(): Player {
		return this._player;
	}

	get statuses(): StatusEffect[] {
		return this._statuses;
	}

	addStatus(status: StatusEffect) {
		for (let i = 0; i < this._statuses.length; i++) {
			if (this._statuses[i].kind == status.kind) {
				this._statuses[i].increment(status.countdown);
				return;
			}
		}
		this._statuses.push(status);
	}

	changeCountdown(x: number): void {
		this._countdown += x;
	}

	enqueue(s: Skill): void {
		this._skillQueue.push(s);
	}

	logText(s: string): void {
		this._log.push(s);
	}

	clearQueue(): void {
		this._skillQueue = new Array<Skill>();
	}

	endTurn(): void {
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

	damage(x: number): void {
		this._health -= x;
	}

	spoils(): Manager {
		let result = new Manager(this._enemyName);
		let ratio = Math.abs(this._health)/this._startingHealth;
		ratio = Math.max(1, Math.floor(ratio));
		result.multiply(ratio);
		return result;
	}

	victory(): void {
		//TODO: more victory code goes here
		this._player.mana.add(this.spoils());
		console.log("battle won!");
	}

	gameover(): void {
		//TODO: game over code goes here
		console.log("battle lost :(");
	}

	private runStatusCallbacks(callback: string) {
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
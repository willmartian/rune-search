/// <reference path="../_references.ts" />

class UsableOnceSkill extends Skill {

	constructor(name: string, desc: string, effect: Function) {
		super(name, desc, effect);
	}

	execute(b: Battle) {
		super.execute(b);
		b.player.revokeSkill(this.name.toLowerCase());
	}

}
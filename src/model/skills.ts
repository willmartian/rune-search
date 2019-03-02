/// <reference path="../_references.ts" />

var skills = {};

function addSkill(s: Skill): void {
	skills[s.name.toLowerCase()] = s;
}

function addSkills(...s: Skill[]): void {
	for (let i = 0; i < s.length; i++) {
		addSkill(s[i]);
	}
}

addSkills(

	new Skill(
		"Bash",
		"Deal 2 damage.",
		Skill.makeDamageEffect(2)
	),

	new Skill(
		"Venom",
		"Inflict 2 poison.",
		Skill.makeStatusEffect(
			StatusEffect.poisonStatus(2);
		)
	),

	new UsableOnceSkill(
		"Disemvoweling Scourge",
		"Deal 999 damage. Usable once only.",
		Skill.makeDamageEffect(999)
	),

	new UsableOnceSkill(
		"Aegis of Divine Unmaking", //someone please give this a better name. maybe a pun one
		"Increase countdown by 5. Usable once only.",
		Skill.makeCountdownEffect(5)
	),

	new UsableOnceSkill(
		"Poison Pen Diatribe",
		"Inflict 100 poison. Usable once only.",
		Skill.makeStatusEffect(
			StatusEffect.poisonStatus(100);
		)
	)
);
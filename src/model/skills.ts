/// <reference path="../_references.ts" />


let skills = {

	slap: new Skill(
		"Slap",
		"Deal 1 damage.",
		Skill.makeDamageEffect(1)
	),

	snek: new Skill(
		"Snek",
		"Inflict 1 poison.",
		Skill.makeStatusEffect(
			StatusEffect.poisonStatus(1)
		)
	),

	stick: new Skill(
		"Stick",
		"Deal 3 damage.",
		Skill.makeDamageEffect(3)
	),

	bop: new Skill(
		"Bop",
		"Deal 4 damage.",
		Skill.makeDamageEffect(4)
	),

	boop: new Skill(
		"Boop",
		"Deal 4 damage twice.",
		Skill.makeRepeatedEffect(
			Skill.makeDamageEffect(4), 2
		)
	),

	hurt: new Skill(
		"Hurt",
		"Deal 5 damage.",
		Skill.makeDamageEffect(5)
	),

	disemvowel: new UsableOnceSkill(
		"Disemvowel",
		"Deal 999 damage! (Useable only once.)",
		Skill.makeDamageEffect(999)
	),

	aegis: new UsableOnceSkill(
		"Aegis of the Divines Unbidden", //someone please give this a better name
		"Increase countdown by 5! (Usable once only.)",
		Skill.makeCountdownEffect(5)
	),

	acidify: new Skill(
		"Acidify",
		"Inflict 1 Fragile.",
		Skill.makeStatusEffect(
			StatusEffect.fragileStatus(1)
		)
	),

	venom: new Skill(
		"Venom",
		"Inflict 2 Poison.",
		Skill.makeStatusEffect(
			StatusEffect.poisonStatus(2)
		)
	),

	constrict: new Skill(
		"Constrict",
		"Inflict 4 Poison and 2 Sloth.",
		Skill.concatEffect(
			Skill.makeStatusEffect(StatusEffect.poisonStatus(4)),
			Skill.makeStatusEffect(StatusEffect.slothStatus(2))
		)
	),

	killrush: new Skill(
		"Kill Rush",
		"Inflict 5 Fragile and 2 Haste.",
		Skill.concatEffect(
			Skill.makeStatusEffect(StatusEffect.fragileStatus(5)),
			Skill.makeStatusEffect(StatusEffect.hasteStatus(2))
		)
	),

	suddenDeath: new Skill(
		"Sudden Death",
		"Inflict 10 Fragile. Do 12 damage. You have one turn left to win.",
		Skill.concatEffect(
			Skill.makeStatusEffect(StatusEffect.fragileStatus(10)),
			Skill.makeDamageEffect(2),
			Skill.makeCountdownSettingEffect(2)
		)
	),

	fanTheHammer: new Skill(
		"Fan the Hammer",
		"Do 2 damage 6 times.",
		Skill.makeRepeatedEffect(
			Skill.makeDamageEffect(2), 6
		)
	),

	poisonPen: new UsableOnceSkill(
		"Poison Pen Diatribe",
		"Inflict 100 Poison. Usable once only.",
		Skill.makeStatusEffect(
			StatusEffect.poisonStatus(100)
		)
	),

	demolitionCharge: new UsableOnceSkill(
		"Demolition Charge",
		"Inflict 25 Fragile. Usable once only.",
		Skill.makeStatusEffect(
			StatusEffect.fragileStatus(25)
		)
	),
}

var allSkillNames = [];

for (let k in skills) {
	allSkillNames.push(k);
}


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


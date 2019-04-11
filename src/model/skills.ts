/// <reference path="../_references.ts" />


let skills = {

	slap: new Skill(
		"Slap",
		"Deal 1 damage.",
		Skill.makeDamageEffect(1)
	),

	disemvowel: new Skill(
		"Disemvowel",
		"Deal 999 damage! (Useable only once.)",
		Skill.makeDamageEffect(999)
	),

	aegis: new UsableOnceSkill(
		"Aegis of Divine Unmaking", //someone please give this a better name
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
		"Inflict 2 poison.",
		Skill.makeStatusEffect(
			StatusEffect.poisonStatus(2)
		)
	),

	fanTheHammer: new Skill(
		"Fan the Hammer",
		"Do 1 damage 6 times.",
		Skill.makeRepeatedEffect(
			Skill.makeDamageEffect(1), 6
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


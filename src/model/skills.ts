/// <reference path="../_references.ts" />


let skills = {

	slap: new Skill(
		"Slap",
		"Deal 2 damage.",
		Skill.makeDamageEffect(2)
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
	)
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
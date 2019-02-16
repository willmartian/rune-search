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
	new Skill("Bash", "Deal 2 damage.", Skill.makeDamageEffect(2))
);
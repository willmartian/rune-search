class PlayerMenu {

	constructor() {
		this.element = document.getElementById("player-menu");
		this.setArt();
	}

	setArt() {
		let artContainer = document.getElementById("player-art");
		let art = xml.getChild("player").getChild("art").DOM.textContent;
		artContainer.innerHTML = "<pre>" + art + "</pre>";
	}

	setInfo() {
		let infoContainer = document.getElementById("player-info");
		let info = game.player.name + ", Health: " + game.player.health + ", Attack: " + game.player.attackDamage;
		infoContainer.innerHTML = "<p>" + info + "</p>";
	}

	update() {
		// this.setArt();
		this.setInfo();
	}
}


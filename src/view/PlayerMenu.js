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

	setInfo(data) {
		let infoContainer = document.getElementById("player-info");
		let info = game.player.name + ", Health: " + game.player.health + ", Attack: "
			+ game.player.attackDamage + "\n" + game.player.mana.toString() + "\n" + game.player.inventoryToString();
		infoContainer.innerHTML = "<p>" + info + "</p>";
	}

	update() {
		let data = this.getData();
		if (data != null) {
			this.setArt(data);
			this.setInfo(data);
		}
	}
}


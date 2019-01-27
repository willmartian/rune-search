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

	update() {}
}


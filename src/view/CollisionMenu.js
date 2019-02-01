class CollisionMenu {
	constructor() {
		this.element = document.getElementById("entity-menu");
	}

	getData() {
		let data;
		if (game.colliding.length > 0) {
			let name = game.colliding[game.colliding.length - 2].constructor.name.toLowerCase();
			data = xml.getChild(name);
			if (!data) {
				data = xml.getChild("default");
			}
			return data;
		}
		return null;
	}

	setArt(data) {
		let artContainer = document.getElementById("entity-art");
		let art = data.getChild("art").DOM.textContent;
		artContainer.innerHTML = "<pre>" + art + "</pre>";
	}

	setInfo(data) {
		let infoContainer = document.getElementById("entity-info");
		let entity = game.colliding[game.colliding.length - 2];
		let info = entity.name;
		infoContainer.innerHTML = "<p>" + info + "</p>";
	}

	//pulling from xml over and over is bad for performance, TODO
	update() {
		let data = this.getData();
		if (data != null) {
			this.setArt(data);
			this.setInfo(data);
		}
	}
}

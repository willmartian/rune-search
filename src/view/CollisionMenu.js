class CollisionMenu {
	constructor() {
		this.element = document.getElementById("collision-menu");
		this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
	}

//TODO: only showing the top entity of the last tile, pls fix
	getData() {
		let data;
		if (this.colliding.length > 0) {
			let name = this.colliding[this.colliding.length - 1].constructor.name.toLowerCase();
			data = xml.getChild(name);
			if (!data) {
				data = xml.getChild("default");
			}
			return data;
		}
		return null;
	}

	setArt(data) {
		let artContainer = document.getElementById("collision-art");
		if (data !== null) {
			let art = data.getChild("art").DOM.textContent;
			artContainer.innerHTML = "<pre>" + art + "</pre>";
		} else {
			artContainer.innerHTML = "";
		}
	}

	setName(data) {
		let nameContainer = document.getElementById("collision-name");
		if (data !== null) {
			let entity = this.colliding[this.colliding.length - 1];
			nameContainer.innerHTML = "<p>" + entity.name + "</p>";
		} else {
			nameContainer.innerHTML = "";
		}
	}

	display(data) {
		let ws = document.getElementById("word-search");
		if (data != null && showCM) {
			this.setArt(data);
			this.setName(data);
			this.element.style.display = "inline";
			ws.style.display = "none";

		} else {
			this.element.style.display = "none";
			ws.style.display = "flex";
		}
	}

	//pulling from xml over and over is bad for performance, TODO
	update() {
		this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
		let data = this.getData();
		this.display(data);
	}
}

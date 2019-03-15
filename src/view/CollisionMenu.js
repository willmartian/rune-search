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

	setMoves() {
		let skills = game.player.skills;
		let skillList = document.getElementById("move-list").children[0];
		let children = skillList.childNodes;
		while (children[1]) {
   			skillList.removeChild(children[1]);
		}
		for (let skill of skills) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode(skill.name));
			skillList.appendChild(li);
		}

		if (skills.length == 0) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode("Empty :("));
			skillList.appendChild(li);
		}
	}

	display(data) {
		let ws = document.getElementById("word-search");
		if (data && showCM) {
			this.setArt(data);
			this.setName(data);
			this.setMoves();
			// this.zoomIn();
			// ws.style.display = "none";
			this.element.style.display = "inline";
			let that = this;
			window.setTimeout(that.zoomIn, 100);
			
		} else {
			// this.zoomOut();
			// this.element.addEventListener("transitionend", function() {
				let cm = document.getElementById("collision-menu");
				cm.style.display = "none";
				// ws.style.display = "flex";
				this.zoomOut();
			// 	cm.removeEventListener("transitionend", this);
			// });
		}
	}

	zoomIn() {
		let cm = document.getElementById("collision-menu");
		if (!cm.classList.contains("zoom")) {
			cm.classList.add("zoom");
		}
		let ws = document.getElementById("word-search");
		if (!ws.classList.contains("blur")) {
			ws.classList.add("blur");
		}

	}

	zoomOut() {
		if (this.element.classList.contains("zoom")) {
			this.element.classList.remove("zoom");
		}
		let ws = document.getElementById("word-search");
		if (ws.classList.contains("blur")) {
			ws.classList.remove("blur");
		}
	}

	//pulling from xml over and over is bad for performance, TODO
	update() {
		this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
		let data = this.getData();
		this.display(data);
	}
}

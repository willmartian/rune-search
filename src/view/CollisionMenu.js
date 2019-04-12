class CollisionMenu {
	constructor() {
		this.element = document.getElementById("collision-menu");
		this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
		this.visible = false;
		this.hpBar = null;
		this.activeSkill = 0; 
		this.entity = this.colliding[this.colliding.length - 1];
		this.showVictory = false;
		this.showDefeat = false;
		this.spoils = null;
	}

//TODO: only showing the top entity of the last tile, pls fix
	getData() {
		let data;
		if (this.colliding.length > 0) {
			let name = this.colliding[this.colliding.length - 1].constructor.name.toLowerCase();
			if (name == "sign") {
				name = this.colliding[this.colliding.length - 1].name.toLowerCase();
			}
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
		let skills = Game.player.skills;
		let skillList = document.getElementById("move-list").children[0];
		let children = skillList.childNodes;
		while (children[1]) {
   			skillList.removeChild(children[1]);
		}
		for (let i = 0; i < skills.length; i++) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode(skills[i].name));
			li.classList.add("skill");
			if (i == this.activeSkill) {
				li.classList.add("active");
				game.battle.logText(this.getActiveSkill().desc);
			}

			skillList.appendChild(li);

			if (i != skills.length - 1) {
				li = document.createElement('li');
				li.appendChild(document.createTextNode(" / "));
				li.classList.add("skill-buffer");
				skillList.appendChild(li);
			}
		}

		if (skills.length == 0) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode("Empty :("));
			skillList.appendChild(li);
		}

		// document.getElementById("move-description").innerHTML = this.getActiveSkill().desc;
		

	}

	getActiveSkill() {
		return Game.player.skills[this.activeSkill];
	}

	updateLog(text) {
		let t;
		if (!text) {
			t = game.battle.topOfLog();
		} else {
			t = text;
		}
		document.getElementById("move-description").innerHTML = t;
	}

	setHealth() {
		let entity = this.colliding[this.colliding.length - 1];
		if (this.hpBar == null) {
			this.hpBar = new HpBar(entity.health);
		}
		this.hpBar.update(entity.health);
		document.getElementById("battle-health-bar").innerHTML = this.hpBar.bar;

	}

	setBattle() {
		if (Battle.active) {
			this.setMoves();
			let turns = document.getElementById("turn-count");
			turns.innerHTML = game.battle.countdown;
			this.setHealth();
			this.updateLog();
			if (this.showVictory) {
				document.getElementById("battle-victory").style.display = "flex";
				if (this.spoils != null) {
					document.getElementById("spoils").innerHTML = "Spoils: " + this.spoils.toString();
				}
			} else {
				document.getElementById("battle-victory").style.display = "none";
			}
			if (this.showDefeat) {
				document.getElementById("battle-defeat").style.display = "flex";
				if (this.spoils != null) {
					document.getElementById("spoils").innerHTML = "Loss: " + this.spoils.toString();
				}
			} else {
				document.getElementById("battle-defeat").style.display = "none";
			}
		}

	}

	display(data) {
		let ws = document.getElementById("word-search");
		if ((data != null) && showCM) {
			this.setArt(data);
			this.setName(data);
			let battle = document.getElementById("battle");
			if (this.colliding[this.colliding.length - 1] instanceof Character) {
				battle.style.display = "block";
				this.setBattle();
			} else {
				battle.style.display = "none";
			}
			this.element.style.display = "inline";
			let that = this;
			window.setTimeout(that.zoomIn, 100);
			this.visible = true;
		} else {
			this.zoomOut();
		}
	}

	closeMenu() {
		let entity = this.colliding[this.colliding.length - 1]
		if (entity instanceof Character) {
			// if (entity.isDead()) {
				entity.die();
				game.tileMap.removeEntity(entity);
			// }
		} else if (entity instanceof Item) {
			game.tileMap.removeEntity(entity);
		} else if (entity instanceof Sign) {
			game.tileMap.removeEntity(entity);
			//makeEntityNotCollideableandVisible
		} else if (entity instanceof Door) {
			let i;
			let keyHad = false;
			for (i = 0; i < Game.player.inventory.length; i++) {
				if (Game.player.inventory[i].name == "Key") {
					Game.player.removeItem(Game.player.inventory[i]);
					game.nextLevel();
					keyHad = true;
					// super.playerCollision();
					// return;
					break;
				}
			}
			if (!keyHad) {
				playerMenu.dialogueKey = "door";
				game.tileMap.removeEntity(entity);
				game.tileMap.insertEntity(entity);
			}
		} else if (entity instanceof WipeDoor) {
			Game.player = new Player(Game.player.name);
			game.nextLevel();
		}
		main.draw();
		this.visible = false;
		this.hpBar = null;
		this.activeSkill = 0;
	}

	zoomIn() {
		let cm = document.getElementById("collision-menu");
		if (!cm.classList.contains("zoom")) {
			cm.classList.add("zoom");
		}
		let elements = document.getElementsByClassName("blurrable");
		for (let i = 0; i < elements.length; i++) {
			// let ws = document.getElementById("word-search");
			if (!elements[i].classList.contains("blur")) {
				elements[i].classList.add("blur");
			}
		}
		// let ws = document.getElementById("word-search");
		// if (!ws.classList.contains("blur")) {
		// 	ws.classList.add("blur");
		// }
	}

	zoomOut() {
		let n = 0;
		let cm = document.getElementById("collision-menu");
		if (cm.classList.contains("zoom")) {
			cm.classList.remove("zoom");
			n += 1;
		}
		// let ws = document.getElementById("word-search");
		// if (ws.classList.contains("blur")) {
		// 	ws.classList.remove("blur");
		// 	n += 1;
		// }
		let elements = document.getElementsByClassName("blurrable");
		for (let i = 0; i < elements.length; i++) {
			// let ws = document.getElementById("word-search");
			if (elements[i].classList.contains("blur")) {
				elements[i].classList.remove("blur");
			}
			if (i == elements.length) {
				n+=1;
			}
		}
		if (n == 2) {
			document.addEventListener("transitionend", function hide(event) {
					if (event.propertyName == "opacity" 
							&& (cm.style.opacity == 0)
							&& cm.style.display != "none") {
						cm.style.display = "none";
					}
					console.log(event);
					document.removeEventListener("transitionend", hide);
			});
		}

	}

	//pulling from xml over and over is bad for performance, TODO
	update() {
		this.colliding = game.colliding.filter(entity => entity.constructor.name !== "Ground");
		this.entity = this.colliding[this.colliding.length - 1];
		let data = this.getData();
		this.display(data);
	}
}

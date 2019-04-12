class PlayerMenu {

	constructor() {
		this.element = document.getElementById("player-menu");
		this.update();
		this.dialogueKey = "instructions";
		this.dialogueIndex = 0;
		this.completedActions = new Set();
		this.instructionsOver = false;
		this.timer = setInterval(this.setTimer, 1000);
		this.time = [0,0,0];
	}

	getData() {
		let data;
		let name = Game.player.name.toLowerCase();
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

	setInfo() {
		this.setMana();
		this.setInventory();
		this.setDialogue();
	}

	setTimer() {
		// let hunger = Game.player.hunger;
		// if (hunger > Game.player.maxHunger) {
		// 	hunger = Game.player.maxHunger;
		// }
		// document.getElementById("player-hunger").innerHTML = "Hunger: " + hunger + "/" + Game.player.maxHunger;
		if (main.canWalk()) {
			playerMenu.time[2] += 1;
		}

		if (playerMenu.time[2] == 60) {
			playerMenu.time[1] += 1;
			playerMenu.time[2] = 0;
		} 

		if (playerMenu.time[1] == 60) {
			playerMenu.time[0] += 1;
			playerMenu.time[1] = 0;
		}

		let displayTime; 

		if (playerMenu.time[0] != 0) {
			displayTime = playerMenu.time[0] + "h " + playerMenu.time[1] + "m " + playerMenu.time[2] + "s";
		} else if (playerMenu.time[1] != 0) {
			displayTime = playerMenu.time[1] + "m " + playerMenu.time[2] + "s";
		} else {
			displayTime = playerMenu.time[2] + "s";
		}

		document.getElementById("player-timer").innerHTML = "Time Lapsed: " + displayTime;
	}


	setDialogue() {
		let dialogueMenu = document.getElementById("player-speech-container");
		if (this.dialogueKey == "") {
			dialogueMenu.style.display = "none";
		} else {
			if (dialogueMenu.style.display == "none") {
				dialogueMenu.style.display = "inline"
			}
			let k = this.dialogueKey;
			let dialogueList = dialogueXML.getChild(k).getChildren();
			if (this.dialogueIndex >= dialogueList.length) {
				let actionKey = this.dialogueKey + "-f";
				this.dialogueActions(actionKey);
				this.dialogueKey = "";
				this.dialogueIndex = 0;
			} else {
				let actionKey = this.dialogueKey + "-d" + (this.dialogueIndex + 1);
				console.log(actionKey);
				this.dialogueActions(actionKey);
				let i = this.dialogueIndex;
				document.getElementById("player-speech").innerHTML = dialogueList[i].DOM.textContent;
			}
		}
	}

	dialogueActions(key) {
		if (this.completedActions.has(key)) {
			return;
		}
		this.completedActions.add(key);
		switch(key) {
			case "instructions-f":
					this.tutorialOver = true;
				break;
			case "door-f":
				break;
			default:
				return;
		}
	}

	setMana() {
		let mana = Game.player.mana;
		document.getElementById("a-mana").innerHTML = mana.a;
		document.getElementById("e-mana").innerHTML = mana.e;
		document.getElementById("i-mana").innerHTML = mana.i;
		document.getElementById("o-mana").innerHTML = mana.o;
		document.getElementById("u-mana").innerHTML = mana.u;
	}

	setInventory() {
		let inventory = Game.player.inventory;
		let inventoryList = document.getElementById("player-inventory-list");
		let children = inventoryList.childNodes;
		while (children[1]) {
   			inventoryList.removeChild(children[1]);
		}
		for (let item of inventory) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode(item.name));
			inventoryList.appendChild(li);
		}

		if (inventory.length == 0) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode("Empty :("));
			inventoryList.appendChild(li);
		}
	}

	update() {
		let data = this.getData();
		if (data != null) {
			this.setArt(data);
			this.setInfo(data);
		}
	}
}


class PlayerMenu {

	constructor() {
		this.element = document.getElementById("player-menu");
		this.update();
		this.dialogueKey = "instructions";
		this.dialogueIndex = 0;
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
		this.setHunger();
		this.setDialogue();
	}

	setHunger() {
		let hunger = Game.player.hunger;
		if (hunger > Game.player.maxHunger) {
			hunger = Game.player.maxHunger;
		}
		document.getElementById("player-hunger").innerHTML = "Hunger: " + hunger + "/" + Game.player.maxHunger;
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
				console.log("test");
				this.dialogueKey = "";
				this.dialogueIndex = 0;
			} else {
				let i = this.dialogueIndex;
				document.getElementById("player-speech").innerHTML = dialogueList[i].DOM.textContent;
			}
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


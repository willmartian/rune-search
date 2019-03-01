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

	setInfo() {
		this.setMana();
		this.setInventory();
	}

	setMana() {
		let mana = game.player.mana;
		document.getElementById("a-mana").innerHTML = mana.a;
		document.getElementById("e-mana").innerHTML = mana.e;
		document.getElementById("i-mana").innerHTML = mana.i;
		document.getElementById("o-mana").innerHTML = mana.o;
		document.getElementById("u-mana").innerHTML = mana.u;
	}

	setInventory() {
		let inventory = game.player.inventory;
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


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
		// let infoContainer = document.getElementById("player-info");
		// let info = game.player.name + ", Health: " + game.player.health + ", Attack: "
		// 	+ game.player.attackDamage + "\n" + game.player.mana.toString() + "\n" + game.player.inventoryToString();
		// infoContainer.innerHTML = "<p>" + info + "</p>";
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
		let inventoryList = document.getElementById("player-inventory");
		while (inventoryList.firstChild) {
   			inventoryList.removeChild(inventoryList.firstChild);
		}
		for (let item of inventory) {
			let li = document.createElement('li');
			li.appendChild(document.createTextNode(item.toString()));
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


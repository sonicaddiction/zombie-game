function Menu() {
	this.titleTxt = null;
	this.startTxt = null;
}

Menu.prototype = {

	create: function () {
		var layer;
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('ground_1x1');

		layer = this.map.createLayer('Tile Layer 1');

		this.input.onDown.add(this.onDown, this);
	},

	update: function () {

	},

	onDown: function () {
		this.game.state.start('game');
	}
};

exports.Menu = Menu;
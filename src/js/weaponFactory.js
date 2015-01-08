var Gun = require('./gun');

function WeaponFactory(game) {
	this.game = game;
}

WeaponFactory.prototype.createPistol = function () {
	var gun = new Gun(this.game, 'bullet', 1000, 1000, function () {
		return 10;
	});
	gun.name = 'Pistol';

	return gun;
}

function get(game) {
	return new WeaponFactory(game);
}

exports.get = get;
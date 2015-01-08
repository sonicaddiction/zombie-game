var Gun = require('./gun');

function WeaponFactory(game) {
	this.game = game;
}

WeaponFactory.prototype.createPistol = function () {
	var gun = new Gun(this.game, 1000, function () {
		return this.game.rnd.integerInRange(1, 6) + this.game.rnd.integerInRange(1, 6) + this.game.rnd.integerInRange(1, 6);
	});
	gun.name = 'Pistol';

	return gun;
}

function get(game) {
	return new WeaponFactory(game);
}

exports.get = get;
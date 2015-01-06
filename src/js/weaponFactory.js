function Gun(sprite, speed) {
	this.sprite = sprite;
	this.speed = speed;
}

function WeaponFactory(game) {
	this.game = game;
}

WeaponFactory.prototype.createPistol = function () {
	var gun,
		sprite = this.game.add.sprite(0, 0, 'bullet');

	sprite.height = 10;
	sprite.width = 15;
	this.game.physics.p2.enable(sprite);
	sprite.kill();

	gun = new Gun(sprite, 1000);
	
	return gun;
}

function get(game) {
	return new WeaponFactory(game);
}

exports.get = get;
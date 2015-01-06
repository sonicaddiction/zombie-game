function Gun(sprite, speed) {
	this.sprite = sprite;
	this.speed = speed;
}

Gun.prototype.fire = function (fromSprite) {
	var weapon = fromSprite.activeWeapon.sprite,
		rotation = fromSprite.rotation,
		x = fromSprite.position.x,
		y = fromSprite.position.y;

	if (this.sprite.alive) return;

	this.sprite.body.rotation = rotation;
	this.sprite.body.x = x;
	this.sprite.body.y = y;
	this.sprite.body.setZeroRotation();

	this.sprite.revive();

	this.sprite.body.moveForward(1000);
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
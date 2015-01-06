function Gun(game, key, speed, scale) {
	this.sprite = game.add.sprite(0, 0, key);
	this.speed = speed;

	if (scale) {
		this.sprite.scale.setTo(scale);
	}

	game.physics.p2.enable(this.sprite);
	this.sprite.kill();
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

module.exports = Gun;
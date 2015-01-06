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

module.exports = Gun;
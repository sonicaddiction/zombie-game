var NUMBER_OF_BULLETS = 10;

function Gun(game, key, speed, shotDelay, scale) {
	var i,
		sprite;
	
	this.game = game;
	this.speed = speed;
	this.shotDelay = shotDelay;
	this.bulletPool = game.add.group();
	this.bulletPool.enableBody = true;
	this.bulletPool.physicsBodyType = Phaser.Physics.P2JS;

	for (i = 0; i < NUMBER_OF_BULLETS; i++) {
		sprite = game.add.sprite(0, 0, key);
		if (scale) {
			sprite.scale.setTo(scale);
		}
		this.bulletPool.add(sprite);
		sprite.kill();
	}
}

Gun.prototype.fire = function (fromSprite) {
	var rotation = fromSprite.rotation,
		x = fromSprite.position.x,
		y = fromSprite.position.y,
		bullet = this.bulletPool.getFirstDead();

    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.shotDelay) return;
    this.lastBulletShotAt = this.game.time.now;

	if (bullet === null || bullet === undefined) return;

	bullet.collisionCount = 0; //Reset number of times bullet has collided
	bullet.body.rotation = rotation;
	bullet.body.x = x;
	bullet.body.y = y;
	bullet.body.setZeroRotation();

	bullet.revive();

	bullet.body.moveForward(this.speed);
}

module.exports = Gun;
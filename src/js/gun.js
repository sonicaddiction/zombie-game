var NUMBER_OF_BULLETS = 10;

function getAngle(body1, body2) {
	var dx = body1.x - body2.x,
		dy = body1.y - body2.y;

	return Math.atan2(dy, dx);
}

function Gun(game, key, speed, shotDelay, damageRollCallback) {
	var i,
		sprite;
	
	this.game = game;
	this.speed = speed;
	this.shotDelay = shotDelay;
}

Gun.prototype.setOwner = function (sprite) {
	this.owner = sprite;
}

function killSprite(sprite) {
	return function () {
		sprite.kill();
	}
}

Gun.prototype.muzzleFlash = function (angle) {
	var sprite = this.game.add.sprite(this.owner.x, this.owner.y, 'muzzle_flash');
	sprite.anchor.set(0, 0.5);
	sprite.scale.setTo(0.1);
	sprite.rotation = angle + Math.PI;
	sprite.lifespan = 30;
}

Gun.prototype.fireVector = function (target, layer) {
	var angle,
		force = 100,
		vector,
		tileHits,
		blood;

	if (!this.owner) return;

	// Check fire delay
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.shotDelay) return;
    this.lastBulletShotAt = this.game.time.now;

    // Check for wall collisions
    vector = new Phaser.Line(this.owner.x, this.owner.y, target.x, target.y);
    //game.debug.geom(vector)
    tileHits = layer.getRayCastTiles(vector, 4, true, false);

    if (tileHits.length > 0 ) {
    	console.log('hit wall');
    	return;
    }

    // Impact with target
    angle = getAngle(this.owner, target);
    this.muzzleFlash(angle);
    target.lastTimeHit = target.game.time.now;
    target.body.applyForce([force * Math.cos(angle),force * Math.sin(angle),0], target.body.x, target.body.y);

    blood = this.game.add.sprite(target.x, target.y, 'blood', this.game.rnd.integerInRange(1, 13));
    blood.scale.setTo(0.2);
    blood.anchor.set(0.5, 0.5);
}

module.exports = Gun;
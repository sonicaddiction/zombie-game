function ZombieFactory(game) {
	this.game = game;
	this.zombieCount = 0;
}

function zombieDeath() {
	var blood = this.game.add.sprite(this.x, this.y, 'blood', this.game.rnd.integerInRange(1, 13));
    blood.scale.setTo(0.5);
    blood.anchor.set(0.5, 0.5);

	console.log('zombie died');
}

function zombieHit(damage) {
	var blood = this.game.add.sprite(this.x, this.y, 'blood', this.game.rnd.integerInRange(1, 13));
    blood.scale.setTo(0.2);
    blood.anchor.set(0.5, 0.5);

    console.log(this.name, 'hit for', damage, 'points of damage.');
	this.damage(damage);
}

ZombieFactory.prototype.createZombie = function (group, x, y, clickCallback) {
	var zombie;

	zombie = group.create(x, y, 'zombie');
	zombie.scale.setTo(1.4);
	zombie.health = 15;

	zombie.body.mass = 1;
	zombie.body.damping = 0.9;
	zombie.body.angularDamping = 0.9;
	zombie.name = 'Zombie #' + this.zombieCount;
	this.zombieCount++;

	zombie.events.onKilled.add(zombieDeath, zombie);
	zombie.events.onHit = new Phaser.Signal();
	zombie.events.onHit.add(zombieHit, zombie);

	return zombie;
}

function get(game) {
	return new ZombieFactory(game);
}

exports.get = get;
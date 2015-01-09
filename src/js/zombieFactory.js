var Helper = require('./helper.js');

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

ZombieFactory.prototype.createZombie = function (group, x, y, player, layer) {
	var zombie,
		that = this;

	zombie = group.create(x, y, 'zombie');
	zombie.scale.setTo(1.4);
	zombie.health = 15;

	zombie.body.mass = 1;
	zombie.body.damping = 0.9;
	zombie.body.angularDamping = 0.9;
	zombie.name = 'Zombie #' + this.zombieCount;
	zombie.body.setCircle(Math.min(zombie.width, zombie.height)/1.4);
	this.zombieCount++;
	zombie.target = null;
	zombie.lastSawPlayerAt = null;

	zombie.events.onKilled.add(zombieDeath, zombie);
	zombie.events.onHit = new Phaser.Signal();
	zombie.events.onHit.add(zombieHit, zombie);

	zombie.update = function () {
		var angle,
			hasLineOfSight = Helper.hasLoS(zombie, player, layer);

		// if(!hasLineOfSight) {
		// 	zombie.visible = false;
		// } else if (hasLineOfSight && zombie.alive) {
		// 	zombie.visible = true;
		// }			

		if (hasLineOfSight) {
			zombie.target = {
				x: player.x,
				y: player.y
			};
		} else {
			//zombie.target = null;
		}

		if (zombie.lastTimeHit) {
			dt = that.game.time.now - zombie.lastTimeHit;
			if (dt < 1000) return;
		}

		if (zombie.target) {
			zombie.body.rotation = Helper.getAngle(zombie, zombie.target) - Math.PI/2;
			zombie.body.moveForward(10);
		}
	};

	return zombie;
}

function get(game) {
	return new ZombieFactory(game);
}

exports.get = get;
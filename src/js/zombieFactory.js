var Helper = require('./helper.js');

function ZombieFactory(game, floorGroup) {
	this.game = game;
	this.floorGroup = floorGroup;
	this.zombieCount = 0;
}

function zombieDeath() {
	var blood = this.game.add.sprite(this.zombie.x, this.zombie.y, 'blood', this.game.rnd.integerInRange(1, 13));
    blood.scale.setTo(0.5);
    blood.anchor.set(0.5, 0.5);
    this.floorGroup.addChild(blood);

	console.log('zombie died');
}

function zombieHit(damage) {
	var blood = this.game.add.sprite(this.zombie.x, this.zombie.y, 'blood', this.game.rnd.integerInRange(1, 13));
    blood.scale.setTo(0.2);
    blood.anchor.set(0.5, 0.5);
    this.floorGroup.addChild(blood);

    console.log(this.zombie.name, 'hit for', damage, 'points of damage.');
	this.zombie.damage(damage);
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

	zombie.events.onKilled.add(zombieDeath, { zombie: zombie, floorGroup: this.floorGroup, game: this.game });
	zombie.events.onHit = new Phaser.Signal();
	zombie.events.onHit.add(zombieHit, { zombie: zombie, floorGroup: this.floorGroup, game: this.game });

	zombie.heardNoise = function (position) {
		// Reacting to noise at position
		zombie.target = position;
	}

	zombie.update = function () {
		var angle,
			da,
			hasLineOfSight = Helper.hasLoS(zombie, player, layer),
			seesPlayer;

		if(!hasLineOfSight) {
			zombie.visible = false;
		} else if (hasLineOfSight && zombie.alive) {
			zombie.visible = true;
		}			

		if (hasLineOfSight) {
			zombie.target = {
				x: player.x,
				y: player.y
			};
		}

		if (zombie.lastTimeHit) {
			dt = that.game.time.now - zombie.lastTimeHit;
			if (dt < 1000) return;
		}

		if (zombie.target) {
			angle = Helper.getAngle(zombie, zombie.target) - Math.PI/2;
			da = zombie.body.rotation - angle;

			if (zombie.body.rotation < 0) {
				zombie.body.rotation += Math.PI * 2; 
			} else if (zombie.body.rotation > Math.PI * 2) {
				zombie.body.rotation -= Math.PI * 2;
			}

			if (da < -Math.PI) {
				da = da + Math.PI*2;
			} else if (da > Math.PI) {
				da = da - Math.PI*2;
			}

			zombie.body.rotation -= da*0.05;
			zombie.body.moveForward(10);

			if (Helper.distance(zombie.target, zombie) < 3) {
				zombie.target = null;
			}
		} else {
			zombie.body.moveForward(5);			
		}
	};

	return zombie;
}

function get(game, floorGroup) {
	return new ZombieFactory(game, floorGroup);
}

exports.get = get;
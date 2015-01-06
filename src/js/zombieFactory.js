function ZombieFactory(game) {
	this.game = game;
}

ZombieFactory.prototype.createZombie = function (group, x, y, clickCallback) {
	var zombie;

	zombie = group.create(x, y, 'zombie');
	zombie.scale.setTo(1.4);
	zombie.health = 12;

	zombie.body.damping = 0.9;
	zombie.body.angularDamping = 0.9;

	zombie.inputEnabled = true;
	zombie.events.onInputDown.add(clickCallback, this);
	
	return zombie;
}

exports.ZombieFactory = ZombieFactory;
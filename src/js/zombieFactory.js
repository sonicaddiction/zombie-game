function ZombieFactory(game) {
	this.game = game;
}

ZombieFactory.prototype.createZombie = function (group, x, y, clickCallback) {
	var zombie;

	zombie = group.create(x, y, 'zombie');
	zombie.scale.setTo(1.4);
	zombie.health = 600;

	zombie.body.damping = 0.9;
	zombie.body.angularDamping = 0.9;
	
	return zombie;
}

function get(game) {
	return new ZombieFactory(game);
}

exports.get = get;
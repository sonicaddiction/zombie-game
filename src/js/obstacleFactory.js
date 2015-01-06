function ObstacleFactory(group, collisionGroup) {
	this.group = group;
	this.collisionGroup = collisionGroup;
	this.collidesWith = [];
}

ObstacleFactory.prototype.setCollidesWith = function (collidesWith) {
	this.collidesWith = collidesWith;
}

ObstacleFactory.prototype.createWall = function (width, height, x, y) {
	var wall = this.group.create(x, y, 'bricks');
	wall.body.static = true;
	wall.body.setCollisionGroup(this.collisionGroup);
	wall.body.collides(this.collidesWith);

	return wall;
}

function get(group, collisionGroup) {
	return new ObstacleFactory(group, collisionGroup);
}

module.exports.get = get;
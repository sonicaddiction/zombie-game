function ObstacleFactory(group, collisionGroup) {
	this.group = group;
	this.collisionGroup = collisionGroup;
	this.collidesWith = [];
}

ObstacleFactory.prototype.setCollidesWith = function (collidesWith) {
	this.collidesWith = collidesWith;
}

ObstacleFactory.prototype.createWall = function (x, y, width, height) {
	var wall = new Phaser.TileSprite(this.group.game, x, y, width, height, 'bricks');
	this.group.add(wall);
	wall.anchor.setTo(0, 0);
	wall.tint = 0x999999;
	wall.body.static = true;
	wall.body.setRectangle(width, height, width/2, height/2);
	wall.body.setCollisionGroup(this.collisionGroup);
	wall.body.collides(this.collidesWith);

	return wall;
}

function get(group, collisionGroup) {
	return new ObstacleFactory(group, collisionGroup);
}

module.exports.get = get;
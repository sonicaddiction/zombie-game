function hasLoS(object1, object2, layer, debug) {
    // Check for wall collisions
    var vector = new Phaser.Line(object1.x, object1.y, object2.x, object2.y);
    //game.debug.geom(vector)
	var tileHits = layer.getRayCastTiles(vector, 4, true, false);

	if (debug) {
		object1.game.debug.geom(vector);
	}

	return tileHits.length === 0;
}

function distance(body1, body2) {
	var dx = body1.x - body2.x,
		dy = body1.y - body2.y;

	return Math.sqrt(dx*dx, dy*dy);
}

function getAngle(body1, body2) {
	var dx = body1.x - body2.x,
		dy = body1.y - body2.y;

	return Math.atan2(dy, dx);
}

module.exports = {
	hasLoS: hasLoS,
	distance: distance,
	getAngle: getAngle
};
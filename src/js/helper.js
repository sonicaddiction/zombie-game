function checkVisibility(zombie, player, layer) {
    // Check for wall collisions
    var vector = new Phaser.Line(player.x, player.y, zombie.x, zombie.y);
    //game.debug.geom(vector)
	var tileHits = layer.getRayCastTiles(vector, 4, true, false);

	if (tileHits.length > 0) {
		zombie.visible = false;
	} else if (zombie.alive) {
		zombie.visible = true;
	}
}


function getAngle(body1, body2) {
	var dx = body1.x - body2.x,
		dy = body1.y - body2.y;

	return Math.atan2(dy, dx);
}

module.exports = {
	checkVisibility: checkVisibility,
	getAngle: getAngle
};
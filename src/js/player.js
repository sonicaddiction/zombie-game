function Player(game, x, y, key) {
	Phaser.Sprite.call(this, game, x, y, key);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function createPlayer(game, x, y) {
	var player = new Player(game, x, y, 'player_walking');
	
	player.anchor.setTo(0.5, 0.5);
	player.scale.set(0.5);
	player.animations.add('walk');
	player.frame = 4;

	game.physics.p2.enable(player);

	player.body.setCircle(Math.min(player.width, player.height)/2);

	return player;
}

module.exports = {
	createPlayer: createPlayer
};
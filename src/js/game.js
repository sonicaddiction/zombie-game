var PLAYER_MAX_VELOCITY = 100,
	PLAYER_ACCELERATION = 800,
	PLAYER_DRAG = 1000,
	ZOMBIE_DRAG = 400;

function Game() {
	this.player = null;
	this.zombies = [];
	this.padding = {};
}

function checkKeys() {
	var cursors = this.game.input.keyboard.createCursorKeys();

	if (cursors.left.isDown) {
		this.player.body.acceleration.x = -PLAYER_ACCELERATION;
	}
	else if (cursors.right.isDown) {
		this.player.body.acceleration.x = PLAYER_ACCELERATION;
	}
	else {
		this.player.body.acceleration.x = 0;
	}
	
	if (cursors.up.isDown) {
		this.player.body.acceleration.y = -PLAYER_ACCELERATION;
	}
	else if (cursors.down.isDown) {
		this.player.body.acceleration.y = PLAYER_ACCELERATION;
	}
	else {	
		this.player.body.acceleration.y = 0;
	}
}

function setupPlayer() {
	var x = this.game.width / 2,
		y = this.game.height / 2;

	this.player = this.add.sprite(x, y, 'player');
	this.player.anchor.setTo(0.5, 0.5);
	this.player.height = 30;
	this.player.width = 30;

	this.game.physics.arcade.enable(this.player);

	this.player.body.maxVelocity.setTo(PLAYER_MAX_VELOCITY, PLAYER_MAX_VELOCITY);
	this.player.body.drag.setTo(PLAYER_DRAG, PLAYER_DRAG);
	this.player.body.collideWorldBounds = true;
}

function createZombie(x, y) {
	var zombie;

	zombie = this.add.sprite(x, y, 'monster');
	zombie.anchor.setTo(0.5, 0.5);
	zombie.height = 30;
	zombie.width = 30;
	
	this.game.physics.arcade.enable(zombie);

	zombie.body.drag.setTo(ZOMBIE_DRAG, ZOMBIE_DRAG);
	zombie.body.collideWorldBounds = true;

	return zombie;
}

function setupWalls() {

}

Game.prototype.create = function () {
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	this.game.stage.backgroundColor = 0x4488cc;

	setupPlayer.call(this);
	this.zombies.push(createZombie.call(this, 100, 100));
	this.zombies.push(createZombie.call(this, 300, 300));

	//this.input.onDown.add(this.onInputDown, this);

	this.padding.x = this.player.width / 2;
	this.padding.y = this.player.height / 2;
};

Game.prototype.update = function () {
	checkKeys.call(this);
	this.game.physics.arcade.collide(this.player, this.zombies, function () {
		console.log('zombie collision');
	});
	this.game.physics.arcade.collide(this.zombies, this.zombies);

};

Game.prototype.onInputDown = function () {
	this.game.state.start('menu');
};

exports.Game = Game;
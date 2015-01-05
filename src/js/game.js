var PLAYER_SPEED = 100,
	ZOMBIE_DRAG = 400;

function Game() {
	this.player = null;
	this.zombies = null;
	this.padding = {};
}

console.log(Phaser.Keyboard);

function checkKeys() {
	var cursors = this.game.input.keyboard.createCursorKeys();

	if (cursors.left.isDown) {this.player.body.rotateLeft(100);}
    else if (cursors.right.isDown){this.player.body.rotateRight(100);}
    else {this.player.body.setZeroRotation();}
    
    if (cursors.up.isDown){this.player.body.moveForward(PLAYER_SPEED);}
    else if (cursors.down.isDown){this.player.body.moveBackward(PLAYER_SPEED);}
    else {this.player.body.setZeroVelocity();}

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    	console.log('space');
    }
}

function setupPlayer() {
	var x = this.game.width / 2,
		y = this.game.height / 2;

	this.player = this.add.sprite(x, y, 'player');
	this.player.anchor.setTo(0.5, 0.5);
	this.player.height = 30;
	this.player.width = 30;

	this.game.physics.p2.enable(this.player);


}

function createZombie(x, y) {
	var zombie;

	zombie = this.add.sprite(x, y, 'zombie');
	zombie.anchor.setTo(0.5, 0.5);
	zombie.height = 30;
	zombie.width = 30;
	
	this.game.physics.p2.enable(zombie);	

	return zombie;
}

function moveZombies() {
	this.zombies.forEachAlive(function (zombies) {

	});
}

Game.prototype.create = function () {
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.defaultRestitution = 0.8;

	this.game.stage.backgroundColor = 0x4488cc;

	setupPlayer.call(this);

	this.zombies = this.game.add.group();	
	//this.zombies.enableBody = true;

	this.zombies.add(createZombie.call(this, 100, 100));
	this.zombies.add(createZombie.call(this, 300, 300));

	this.padding.x = this.player.width / 2;
	this.padding.y = this.player.height / 2;
};

Game.prototype.update = function () {
	checkKeys.call(this);
	moveZombies.call(this);
};

Game.prototype.onInputDown = function () {
	this.game.state.start('menu');
};

exports.Game = Game;
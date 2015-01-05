var PLAYER_SPEED = 100,
	ZOMBIE_DRAG = 400;

function Game() {
	this.player = null;
	this.zombies = null;
	this.padding = {};
}

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
		y = this.game.height / 2,
		player = this.add.sprite(x, y, 'player');
	
	player.anchor.setTo(0.5, 0.5);
	player.height = 30;
	player.width = 30;

	this.game.physics.p2.enable(player);

	return player;
}

function createZombie(group, x, y) {
	var zombie;

	zombie = group.create(x, y, 'zombie');
	zombie.height = 30;
	zombie.width = 30;
	
	return zombie;
}

function moveZombies() {
	this.zombies.forEachAlive(function (zombies) {

	});
}

function zombieCollision(player, zombie) {
	console.log(player, ' hit by ', zombie);
}

Game.prototype.create = function () {
	var zombieCollisionGroup,
		playerCollisionGroup,
		zombie;

	// Setup visual scene
	this.game.stage.backgroundColor = 0x4488cc;

	// Setup physics
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.defaultRestitution = 0.8;
	this.game.physics.p2.restitution = 0.8;
	this.game.physics.p2.setImpactEvents(true);
	this.game.physics.p2.updateBoundsCollisionGroup();

	zombieCollisionGroup = this.game.physics.p2.createCollisionGroup();
	playerCollisionGroup = this.game.physics.p2.createCollisionGroup();

	// Create zombies
	this.zombies = this.game.add.group();
	this.zombies.enableBody = true;
	this.zombies.physicsBodyType = Phaser.Physics.P2JS;
	
	zombie = createZombie(this.zombies, 400, 300);
	zombie.body.setCollisionGroup(zombieCollisionGroup);
	zombie.body.collides([zombieCollisionGroup, playerCollisionGroup]);

	// Create player
	this.player = setupPlayer.call(this);
	this.player.body.setCollisionGroup(playerCollisionGroup);
	this.player.body.collides(zombieCollisionGroup, zombieCollision, this);

	console.log(zombieCollisionGroup);
};

Game.prototype.update = function () {
	checkKeys.call(this);
	moveZombies.call(this);
};

Game.prototype.onInputDown = function () {
	this.game.state.start('menu');
};

exports.Game = Game;
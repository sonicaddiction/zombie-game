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
    	useWeapon.call(this);
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
	var x = this.player.body.x,
		y = this.player.body.y;

	this.zombies.forEachAlive(function (zombie) {
		var dx = x - zombie.body.x,
			dy = y - zombie.body.y,
			angle = Math.atan2(dy, dx);

		zombie.body.rotation = angle + Math.PI/2;
		zombie.body.moveForward(10);
	});
}

function zombieCollision(player, zombie) {
}

function hitZombieWithWeapon(bullet, zombie) {
	bullet.sprite.kill();
}

function createWeapon(group) {
	var weapon = this.add.sprite(0, 0, 'bullet');

	weapon.height = 10;
	weapon.width = 15;

	this.game.physics.p2.enable(weapon);
	weapon.body.mass = 0.01;
	weapon.kill();

	return weapon;
}

function useWeapon() {
	var weapon = this.player.activeWeapon,
		rotation = this.player.rotation,
		x = this.player.position.x,
		y = this.player.position.y;

	if (weapon.alive) return;

	weapon.body.rotation = rotation;
	weapon.body.x = x;
	weapon.body.y = y;
	weapon.body.setZeroRotation();

	weapon.revive();

	weapon.body.moveForward(1000);
	
}

Game.prototype.create = function () {
	var zombieCollisionGroup,
		playerCollisionGroup,
		weaponCollisionGroup,
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
	weaponCollisionGroup = this.game.physics.p2.createCollisionGroup();

	// Create zombies
	this.zombies = this.game.add.group();
	this.zombies.enableBody = true;
	this.zombies.physicsBodyType = Phaser.Physics.P2JS;
	
	zombie = createZombie(this.zombies, 400, 300);
	zombie.body.damping = 0.9;
	zombie.body.angularDamping = 0.9;
	zombie.body.setCollisionGroup(zombieCollisionGroup);
	zombie.body.collides([zombieCollisionGroup, playerCollisionGroup, weaponCollisionGroup]);

	// Create player
	this.player = setupPlayer.call(this);
	this.player.body.setCollisionGroup(playerCollisionGroup);
	this.player.body.collides(zombieCollisionGroup, zombieCollision, this);

	// Create weapon
	this.player.activeWeapon = createWeapon.call(this);
	this.player.activeWeapon.body.setCollisionGroup(weaponCollisionGroup);
	this.player.activeWeapon.body.collides(zombieCollisionGroup, hitZombieWithWeapon, this);
};

Game.prototype.update = function () {
	checkKeys.call(this);
	moveZombies.call(this);
};

Game.prototype.onInputDown = function () {
	this.game.state.start('menu');
};

exports.Game = Game;
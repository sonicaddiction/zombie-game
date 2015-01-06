var ZombieFactory = require('./zombieFactory.js'),
	WeaponFactory = require('./weaponFactory.js'),
	obstacleFactory = require('./obstacleFactory.js'),
	PLAYER_SPEED = 100,
	FLOOR_SCALE = 2;

function Game() {
	this.player = null;
	this.zombies = null;
	this.selectedObject = 0;
	this.selectionMarker = null;
	this.zombieFactory = null;
	this.weaponFactory = null;
	this.obstacleFactory = null;
}

function checkKeys() {
	var cursors = this.game.input.keyboard.createCursorKeys();

	if (cursors.left.isDown) {
		this.player.body.rotateLeft(100);
	}
    else if (cursors.right.isDown) {
    	this.player.body.rotateRight(100);
    }
    else {this.player.body.setZeroRotation();}
    
    if (cursors.up.isDown) {
    	this.player.body.moveForward(PLAYER_SPEED);
    	this.player.animations.play('walk', 25, true);
    }
    else if (cursors.down.isDown) {
    	this.player.body.moveBackward(PLAYER_SPEED);
    	this.player.animations.play('walk', 25, true);
    }
    else {
    	this.player.body.setZeroVelocity();
    	this.player.animations.stop('walk');
    	this.player.frame = 4;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    	this.player.activeWeapon.fire(this.player);
    }
}

function setupPlayer() {
	var x = this.game.width / 2,
		y = this.game.height / 2,
		player = this.add.sprite(100, 100, 'player_walking');
	
	player.anchor.setTo(0.5, 0.5);
	player.scale.set(0.5);
	player.animations.add('walk');
	player.frame = 4;

	this.game.physics.p2.enable(player);

	return player;
}

function moveZombies() {
	var x = this.player.body.x,
		y = this.player.body.y,
		that = this,
		index = 0;

	this.zombies.forEachAlive(function (zombie) {
		var angle = getAngle(that.player.body, zombie.body);
			elapsedTime = that.game.time.totalElapsedSeconds(),
			random = that.game.rnd.realInRange(15, 25);

		zombie.body.rotation = angle + Math.PI/2;
		zombie.body.moveForward(Math.max(Math.sin(elapsedTime*4+index)*random, 0));
		index++;
	});
}

function getAngle(body1, body2) {
	var dx = body1.x - body2.x,
		dy = body1.y - body2.y;

	return Math.atan2(dy, dx);
}

function zombieCollision(player, zombie) {
	console.log('Crunch crunch crunch');
}

function focusOnZombie(zombie) {
	var angle = getAngle(zombie.body, this.player.body);

	this.player.body.rotation = angle + Math.PI / 2;

	this.selectedObject = zombie;
	this.selectionMarker.drawCircle(0, 0, Math.max(zombie.width, zombie.height) + 30);
}

function releaseFocusOnZombie(zombie) {
	this.selectedObject = null;
}

function hitZombieWithWeapon(bullet, zombie) {
	var damage = this.speed = Math.sqrt(bullet.velocity.x * bullet.velocity.x + bullet.velocity.y * bullet.velocity.y);
	bullet.sprite.kill();
	zombie.sprite.damage(damage);
}

Game.prototype.create = function () {
	var zombieCollisionGroup,
		playerCollisionGroup,
		weaponCollisionGroup,
		wallCollisionGroup,
		zombie,
		wall,
		i,
		floor;

	// Setup factories
	this.zombieFactory = ZombieFactory.get(this.game);
	this.weaponFactory = WeaponFactory.get(this.game);

	// Setup visual scene
	floor = this.game.add.tileSprite(0, 0, this.game.world.width*FLOOR_SCALE, this.game.world.height*FLOOR_SCALE, 'floor');
	floor.scale.set(1/FLOOR_SCALE);
	floor.tint = 0xaa6666;

	// Selection marker
	this.selectionMarker = this.game.add.graphics(0, 0);
	this.selectionMarker.lineStyle(1, 0x00ff00, 1);
	this.selectionMarker.visible = false;

	// Setup physics
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.defaultRestitution = 0.8;
	this.game.physics.p2.restitution = 0.8;
	this.game.physics.p2.setImpactEvents(true);
	this.game.physics.p2.updateBoundsCollisionGroup();

	zombieCollisionGroup = this.game.physics.p2.createCollisionGroup();
	playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
	weaponCollisionGroup = this.game.physics.p2.createCollisionGroup();
	wallCollisionGroup = this.game.physics.p2.createCollisionGroup();

	// Create walls
	this.walls = this.game.add.group();
	this.walls.enableBody = true;
	this.walls.physicsBodyType = Phaser.Physics.P2JS;
	this.obstacleFactory = obstacleFactory.get(this.walls, wallCollisionGroup);
	
	this.obstacleFactory.setCollidesWith([zombieCollisionGroup, playerCollisionGroup, weaponCollisionGroup]);
	wall = this.obstacleFactory.createWall(10, 100, 200, 200);

	// Create zombies
	this.zombies = this.game.add.group();
	this.zombies.enableBody = true;
	this.zombies.physicsBodyType = Phaser.Physics.P2JS;
	
	for (i = 0; i < 10; i++) {
		zombie = this.zombieFactory.createZombie(this.zombies, this.game.world.randomX, this.game.world.randomY);
		zombie.body.setCollisionGroup(zombieCollisionGroup);
		zombie.body.collides([zombieCollisionGroup, playerCollisionGroup, weaponCollisionGroup, wallCollisionGroup]);
	}

	this.zombies.setAll('inputEnabled', true);
	this.zombies.callAll('events.onInputDown.add', 'events.onInputDown', focusOnZombie, this);
	this.zombies.callAll('events.onInputDown.add', 'events.onInputUp', releaseFocusOnZombie, this);

	// Create player
	this.player = setupPlayer.call(this);
	this.player.body.setCollisionGroup(playerCollisionGroup);
	this.player.body.collides(zombieCollisionGroup, zombieCollision, this);
	this.player.body.collides(wallCollisionGroup);

	// Create weapon
	this.player.activeWeapon = this.weaponFactory.createPistol();
	this.player.activeWeapon.sprite.body.setCollisionGroup(weaponCollisionGroup);
	this.player.activeWeapon.sprite.body.collides(zombieCollisionGroup, hitZombieWithWeapon, this);
	this.player.activeWeapon.sprite.body.collides(wallCollisionGroup);

};

function renderSelectionMarker() {
	if (!this.selectedObject || this.selectedObject.alive === false) {
		this.selectionMarker.visible = false;
		return
	};
	
	this.selectionMarker.x = this.selectedObject.x;
	this.selectionMarker.y = this.selectedObject.y;

	this.selectionMarker.visible = true;
}

Game.prototype.update = function () {
	checkKeys.call(this);
	moveZombies.call(this);
	renderSelectionMarker.call(this);
};

Game.prototype.onInputDown = function () {
	this.game.state.start('menu');
};

exports.Game = Game;

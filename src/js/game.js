var ZombieFactory = require('./zombieFactory.js').ZombieFactory,
	PLAYER_SPEED = 100,
	FLOOR_SCALE = 2;

function Game() {
	this.player = null;
	this.zombies = null;
	this.padding = {}
	this.selectedObject = 0;
	this.selectionMarker = null;
	this.zombieFactory = new ZombieFactory(this.game);
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
    	useWeapon.call(this);
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
}

function clickedZombie(zombie) {
	var angle = getAngle(zombie.body, this.player.body);

	this.player.body.rotation = angle + Math.PI / 2;

	this.selectedObject = zombie;
	this.selectionMarker.drawCircle(0, 0, Math.max(zombie.width, zombie.height) + 30);
}

function hitZombieWithWeapon(bullet, zombie) {
	var damageRoll = bullet.sprite.damageRoll();
	bullet.sprite.kill();
	zombie.sprite.damage(damageRoll);
}

function createWeapon(group) {
	var weapon = this.add.sprite(0, 0, 'bullet');

	weapon.height = 10;
	weapon.width = 15;

	this.game.physics.p2.enable(weapon);
	weapon.body.mass = 100;
	weapon.body.bounce = 0.001;
	
	weapon.damageRoll = function () {
		return this.game.rnd.realInRange(1, 6) + this.game.rnd.realInRange(1, 6);
	}
	
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
		zombie,
		i,
		floor;

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

	// Create zombies
	this.zombies = this.game.add.group();
	this.zombies.enableBody = true;
	this.zombies.physicsBodyType = Phaser.Physics.P2JS;
	
	for (i = 0; i < 10; i++) {
		zombie = this.zombieFactory.createZombie(this.zombies, this.game.world.randomX, this.game.world.randomY, clickedZombie);
		zombie.body.setCollisionGroup(zombieCollisionGroup);
		zombie.body.collides([zombieCollisionGroup, playerCollisionGroup, weaponCollisionGroup]);
	}

	// Create player
	this.player = setupPlayer.call(this);
	this.player.body.setCollisionGroup(playerCollisionGroup);
	this.player.body.collides(zombieCollisionGroup, zombieCollision, this);

	// Create weapon
	this.player.activeWeapon = createWeapon.call(this);
	this.player.activeWeapon.body.setCollisionGroup(weaponCollisionGroup);
	this.player.activeWeapon.body.collides(zombieCollisionGroup, hitZombieWithWeapon, this);

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

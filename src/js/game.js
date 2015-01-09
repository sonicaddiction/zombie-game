var ZombieFactory = require('./zombieFactory.js'),
	WeaponFactory = require('./weaponFactory.js'),
	obstacleFactory = require('./obstacleFactory.js'),
	Helper = require('./helper.js'),
	PLAYER_SPEED = 100,
	FLOOR_SCALE = 5,
	WALL_WIDTH = 15,
	createPlayer = require('./player').createPlayer;

function Game() {
	this.player = null;
	this.zombies = null;
	this.selectedObject = 0;
	this.selectionMarker = null;
	this.zombieFactory = null;
	this.weaponFactory = null;
	this.obstacleFactory = null;
	this.mainGroup = null;
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
    	if (this.selectedObject) {
    		this.player.activeWeapon.fireGun(this.selectedObject, this.wallLayer);
    	}
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
    	this.player.activeWeapon.reload();
    }
}


function zombieCollision(player, zombie) {
	console.log('Crunch crunch crunch');
}

function focusOnZombie(zombie) {
	var angle = Helper.getAngle(zombie.body, this.player.body);

	this.player.body.rotation = angle + Math.PI / 2;

	this.selectedObject = zombie;
}

function releaseFocusOnZombie(zombie) {
	this.selectedObject = null;
}

function bulletHitWall(bullet) {
	bullet.sprite.kill();
}

Game.prototype.create = function () {
	var zombieCollisionGroup,
		playerCollisionGroup,
		wallCollisionGroup,
		zombie,
		wall,
		i,
		floor,
		layer,
		eligibleZombieSpawnTiles = [];

	this.mainGroup = this.game.add.group();
	this.floorGroup = this.game.add.group();

	// Setup factories
	this.zombieFactory = ZombieFactory.get(this.game, this.floorGroup);
	this.weaponFactory = WeaponFactory.get(this.game);

	// Setup visual scene
	floor = this.game.add.tileSprite(0, 0, this.game.world.width*FLOOR_SCALE, this.game.world.height*FLOOR_SCALE, 'floor');
	floor.scale.set(1/FLOOR_SCALE);
	floor.tint = 0x666666;
	this.floorGroup.addChild(floor);

	// Selection marker
	this.selectionMarker = this.game.add.graphics(0, 0);
	this.selectionMarker.lineStyle(1, 0xffffff, 1);
	this.selectionMarker.visible = false;

	// Setup physics
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.defaultRestitution = 0.8;
	this.game.physics.p2.restitution = 0.8;
	this.game.physics.p2.setImpactEvents(true);
	this.game.physics.p2.updateBoundsCollisionGroup();

	zombieCollisionGroup = this.game.physics.p2.createCollisionGroup();
	playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
	wallCollisionGroup = this.game.physics.p2.createCollisionGroup();

	// Create walls
	this.tileMap = this.game.add.tilemap('map');
	this.tileMap.addTilesetImage('ground_1x1');

	this.wallLayer = this.tileMap.createLayer('Walls');
	this.tileMap.setCollisionBetween(1, 23);

	this.walls = this.game.physics.p2.convertTilemap(this.tileMap, this.wallLayer);
	this.walls.forEach(function (wall) {
		wall.setCollisionGroup(wallCollisionGroup);
		wall.collides([playerCollisionGroup, zombieCollisionGroup]);
	});

	// Create player
	this.player = createPlayer(this.game, 500, 100);
	this.player.body.setCollisionGroup(playerCollisionGroup);
	this.player.body.collides(zombieCollisionGroup, zombieCollision, this);
	this.player.body.collides(wallCollisionGroup);

	// Create zombies
	this.zombies = this.game.add.group();
	this.zombies.enableBody = true;
	this.zombies.physicsBodyType = Phaser.Physics.P2JS;

	this.tileMap.forEach(function (tile) {
		if (tile.index === 1) return;
		eligibleZombieSpawnTiles.push(tile);
	}, this);

	for (i = 0; i < 10; i++) {
		var spawnTile = this.game.rnd.pick(eligibleZombieSpawnTiles);
		zombie = this.zombieFactory.createZombie(this.zombies, spawnTile.worldX+16, spawnTile.worldY+16, this.player, this.wallLayer);
	 	zombie.body.setCollisionGroup(zombieCollisionGroup);
	 	zombie.body.collides([zombieCollisionGroup, playerCollisionGroup, wallCollisionGroup]);
	}

	this.zombies.setAll('inputEnabled', true);
	this.zombies.callAll('events.onInputDown.add', 'events.onInputDown', focusOnZombie, this);
	this.zombies.callAll('events.onInputDown.add', 'events.onInputUp', releaseFocusOnZombie, this);

	// Create weapon
	this.player.activeWeapon = this.weaponFactory.createPistol();
	this.player.activeWeapon.setOwner(this.player);

	this.mainGroup.addChild(this.floorGroup);
	this.mainGroup.addChild(this.zombies);
	this.mainGroup.addChild(this.player);

	displayStats.call(this);
};

function renderSelectionMarker() {
	var diameter;

	if (!this.selectedObject || this.selectedObject.alive === false) {
		this.selectionMarker.visible = false;
		return
	};
	
	this.selectionMarker.clear();	

	diameter = Math.max(this.selectedObject.width, this.selectedObject.height) + 30;
	if (Helper.hasLoS(this.player, this.selectedObject, this.wallLayer)) {
		this.selectionMarker.lineStyle(1, 0x00ff00, 1);
		this.selectionMarker.moveTo(-diameter*0.25, 0);
		this.selectionMarker.lineTo(diameter*0.25, 0);
		this.selectionMarker.moveTo(0, -diameter*0.25);
		this.selectionMarker.lineTo(0, diameter*0.25);
		this.selectionMarker.moveTo(0, 0);
		this.selectionMarker.drawCircle(0, 0, diameter);
	} else {
		this.selectionMarker.lineStyle(1, 0xff0000, 1);
		this.selectionMarker.drawCircle(0, 0, diameter);
	}


	this.selectionMarker.x = this.selectedObject.x;
	this.selectionMarker.y = this.selectedObject.y;

	this.selectionMarker.visible = true;
}

function displayStats() {
	var style = { font: "16px Arial", fill: "#ffffff", align: "center" };
	this.stats = this.game.add.text(8, 6, "Ammo:", style);
}

function updateStats() {
	this.stats.text = 'Ammo: ' + this.player.activeWeapon.ammo;
}

Game.prototype.update = function () {
	renderSelectionMarker.call(this);
	checkKeys.call(this);
	updateStats.call(this);
};

Game.prototype.onInputDown = function () {
	this.game.state.start('menu');
};

exports.Game = Game;

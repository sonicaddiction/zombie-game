function Preloader() {
	this.asset = null;
	this.ready = false;
}

Preloader.prototype.onLoadComplete = function () {
	this.ready = true;
}

Preloader.prototype.update = function () {
	if (!!this.ready) {
		this.game.state.start('menu');
	}
}

Preloader.prototype.create = function () {
	this.asset.cropEnabled = false;
}

Preloader.prototype.preload = function () {
	this.asset = this.add.sprite(320, 240, 'preloader');
	this.asset.anchor.setTo(0.5, 0.5);

	this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
	this.load.setPreloadSprite(this.asset);
	this.load.image('player', 'assets/player.gif');
	this.load.image('zombie', 'assets/zombie.gif');
	this.load.image('bullet', 'assets/bullet.png');
	this.load.image('floor', 'assets/checkered_floor.jpg');
	this.load.image('ground_1x1', 'assets/ground_1x1.png');
	this.load.image('muzzle_flash', 'assets/muzzle_flash.png');
	this.load.spritesheet('player_walking', 'assets/player_walking.png', 88, 98, 15);
	this.load.tilemap('map', 'assets/tileMap.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.spritesheet('blood', 'assets/blood.png', 100, 100, 16);
}

exports.Preloader = Preloader;

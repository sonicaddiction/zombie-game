var Boot = require('./boot.js').Boot,
	Preloader = require('./preloader.js').Preloader,
	Menu = require('./menu.js').Menu,
	Game = require('./game.js').Game;

window.onload = function () {
	'use strict';

	var game;

	game = new Phaser.Game(800, 640, Phaser.AUTO, 'zombies-game');
	game.state.add('boot', Boot);
	game.state.add('preloader', Preloader);
	game.state.add('menu', Game);
	game.state.add('game', Game);

	game.state.start('boot');
};

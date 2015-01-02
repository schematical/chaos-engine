'use strict';


// Declare app level module which depends on filters, and services
angular.module(
		'wheezy',
		[
			'ngCookies'
		]
	).config(
		[
			function () {

			}
		]
	).run([
		'$timeout',
		'GameScreen',
		'Socket',
		function ($timeout, GameScreen, Socket) {

			console.log(Socket);
			$timeout(function(){
				var gameScreen = new GameScreen();
				gameScreen.resize();
			}, 2000);
		}
	])
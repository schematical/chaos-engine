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
		'ObjectCache',
		function ($timeout, GameScreen, Socket, ObjectCache) {
			ObjectCache.preload();


		}
	])
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
		'$document',
		'$rootScope',
		'$timeout',
		'GameScreen',
		'Socket',
		'ObjectCache',
		function ($document, $rootScope, $timeout, GameScreen, Socket, ObjectCache) {
			ObjectCache.preload();


		}
	])
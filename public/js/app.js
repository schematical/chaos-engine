'use strict';


// Declare app level module which depends on filters, and services
angular.module(
		'chaos_engine',
		[
			'ngCookies',
			'ngTable'
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
			Socket.init();


		}
	])

/** -----------------------------------

 DEBUG CONTROLLER

 ---------------------------------*/

angular.module('chaos_engine')
	.controller('DebugController', [
		'$document',
		'$scope',
		'$cookies',
		'ngTableParams',
		'WorldCache',
		function($document,$scope, $cookies,ngTableParams, WorldCache){
			WorldCache.on('update', function(world){
				console.log("Update:", world);
				var collection = [];
				for(var i in world.objects){
					collection.push(world.objects[i]);
				}
				$scope.collection = collection;
			/*	$scope.tableParams = new ngTableParams(
					{
						page: 1,            // show first page
						count: 10           // count per page
					},
					{
						total: world.objects.length, // length of data
						getData: function ($defer, params) {
							var keys = Object.keys(world.objects).slice((params.page() - 1) * params.count(), params.page() * params.count());
							var objects
							$defer.resolve(

							);
						}
					}
				);*/
			})


		}
	]
);
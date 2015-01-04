var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.Game = function(options){
		var default_options = {
			world: new app.World()
		}
		var options = _.extend(default_options, options);

		//SETUP DOG
		var game = new app.Engine(options);
		var blindDog = new app.TheBlindDog({
			id:'blindDog-1',
			world:game.world
		})
		blindDog.setXY(10, 10);



		//SETUP app.objects.Beretta
		var beretta = new app.objects.Beretta({
			id:'beretta-1',
			world: game.world
		});
		beretta.setXY(2,3);

		return game;
	}
}
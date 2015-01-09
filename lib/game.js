var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.Game = function(options){
		var default_options = {
			world: new app.World()
		}
		var options = _.extend(default_options, options);


		var game = new app.Engine(options);



		//SETUP DOG
		var blindDog = new app.TheBlindDog({
			id:'blindDog-1',
			world:game.world
		})
		blindDog.setXY(10, 10);
		var RAT_CT = 5;
		var rats = [];
		for(var i = 0; i < RAT_CT; i++){
			var rat = new app.Rat({
				id:'rat-' + i,
				world:game.world
			});

			rat.setXY(
				Math.floor(Math.random() * game.world.width),
				Math.floor(Math.random() * game.world.height)
			);

			rats.push(rat);

		}




		//SETUP app.objects.Beretta
		var revolver = new app.objects.Revolver({
			id:'revolver-1',
			world: game.world
		});
		revolver.setXY(2,3);

		return game;
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.Game = function(options){
		var default_options = {
			world: new app.World(),
			RAT_CT:1,//5,
			FOOD_CT:25
		}
		var options = _.extend(default_options, options);


		var game = new app.Engine(options);



		//SETUP DOG
		var dogmeat = new app.Dogmeat({
			id:'dogmeat-1',
			world:game.world
		})
		dogmeat.setXY(10, 10);


		var rats = game.world.spawnRandom(function(index){
			var rat = new app.Rat({
				id:'rat-' + index,
				world:game.world
			});
			return rat;
		}, game.RAT_CT);
		/*rats[0].setXY(
			1,
			5
		);*/
		var food = game.world.spawnRandom(function(index){
			var food = new app.objects.food.Bacon({
				id:'food-1-' + index,
				world:game.world
			});
			return food;
		}, game.FOOD_CT);
		food[0].setXY(
			6,
			5
		);




		//SETUP app.objects.Revolver
		var revolver = new app.objects.Revolver({
			id:'revolver-1',
			world: game.world
		});
		revolver.setXY(4,4);

		return game;
	}
}
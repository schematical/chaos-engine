var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.Game = function(options){
		var default_options = {
			world: null,
			RAT_CT:10,
			FOOD_CT:5,
			ANT_CT:10
		}
		var options = _.extend(default_options, options);
		/*if(!options.world){
			options.world = new app.World();
		}*/

		var game = new app.Engine(options);

		return game;
	}
}
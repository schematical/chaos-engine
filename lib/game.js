var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.Game = function(options){
		var default_options = {
			world: new app.World()
		}
		var options = _.extend(default_options, options);

		var game = new app.Engine(options);


		return game;
	}
}
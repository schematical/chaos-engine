var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.PlayerBase = function(options){
		var default_options = {
			type:'player-1'
		}
		_.extend(options, default_options);

		return new app.PhysicalObjectBase(options);
	}
}
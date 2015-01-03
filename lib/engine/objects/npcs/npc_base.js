var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.NPCBase = function(options){
		var default_options = {
			/*type:'player-1'*/
			age:1,
			size:50,
			energy:10,
			energy_consumption:1
		}
		_.extend(options, default_options);

		return new app.PhysicalObjectBase(options);
	}

}
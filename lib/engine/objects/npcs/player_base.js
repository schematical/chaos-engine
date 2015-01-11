var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.PlayerBase = function(options){
		var default_options = {
			race:'human',
			type:'player-1',
			gender:'m'
		}
		_.extend(default_options, options);

		var npc_base = new app.NPCBase(default_options);
		npc_base.cycle = function(cb){
			return cb();
		}
		return npc_base;
	}
}
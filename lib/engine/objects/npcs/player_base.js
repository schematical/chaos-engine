var async = require('async');
var _ = require('underscore');
module.exports = function(app){
 	app.PlayerBase = function(options){
		var default_options = {
			type:'player-1'
		}
		_.extend(options, default_options);

		var npc_base = new app.NPCBase(options);
		npc_base.cycle = function(cb){
			return cb();
		}
		return npc_base;
	}
}
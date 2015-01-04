var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.NPCBase = function(options){
		var default_options = {
			/*type:'player-1'*/
			age:1,
			size:50,
			energy:10,
			energy_consumption:1,
			brain:{}
		}
		_.extend(options, default_options);

		var npc_base = new app.PhysicalObjectBase(options);
		//Register it globally as an NPC
		npc_base.world.add_npc(npc_base);
		npc_base.cycle = function(cb){
			//Eventually run through setup logic
			var brain = this.brain;
			return async.eachSeries(
			    Object.keys(this.brain),
				function(key, cb){
					return brain[key].process(cb)
			    },
			    function(errs){
					return cb();
			    }
			)
			/*return cb();*/
		}
		npc_base.addLogicNode = function(inputNode, namespace){
			if(!namespace){
				namespace = this.id + '-logic-node-' + Object.keys(this.brain).length;
			}
			this.brain[namespace] = inputNode;
		}
		return npc_base;
	}

}
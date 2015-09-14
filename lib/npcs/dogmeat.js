var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.npcs.Dogmeat = function(options){
		var default_options = {
			npc_class:'Dogmeat',
			type:'dogmeat',
			race:'dog',
			nourishment:40,
			health:50
		}
		_.extend(default_options, options);
		var npc_base = new app.NPCBase(default_options);
		npc_base.spawn = function(){
			var quadriped = new app.perks.QuadripedBasePerk({ npc: npc_base });
			var meaty = new app.perks.MeatyPerk({ npc: npc_base });
			app.LogicFactory.survival_101(npc_base);
			app.LogicFactory.carnivore(npc_base);
			/**
			 * Follow people like a loyal dog
			 * @type {.logic.outputs.Follow}
			 */
			var follow = new app.logic.outputs.Follow({
				npc:npc_base
			});
			var smell_follow = new app.logic.inputs.Smell({
				npc:npc_base,
				range:5,
				target: new app.ObjectTarget({
					/* HOW ever you select pretty much anything */
					race:'human'
				})
			});
			smell_follow.outputNode(follow);
			npc_base.addLogicNode(smell_follow);
		}
		/*npc_base.on('collision', function(event, data, next){
			//console.log("Arfff");
			return next();
		});*/


		return npc_base;
	}
}
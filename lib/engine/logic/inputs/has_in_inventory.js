var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.inputs.HasInInventory = function(options){

		var default_options = {
			object_type:null//The Object to look for
		}
		_.extend(default_options, options);

		var logic_node_base = new app.InputNodeBase(default_options);

		logic_node_base.condition(function(data, cb){

			for(var i in logic_node_base.npc.inventory){
				//console.log('Checking:', logic_node_base.npc.inventory[i].type, 'vs', logic_node_base.type);
				if(logic_node_base.target.match(logic_node_base.npc.inventory[i])){
					console.log("Found in inventory:" + logic_node_base.npc.inventory[i].type);
					return this.trigger(
						{
							target:logic_node_base.npc.inventory[i]
						},
						cb
					);
				}
			}
			return cb();

		});
		return logic_node_base;
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.inputs.HasInInventory = function(options){

		var default_options = {
			type:'HasInInventory',
			target:null//The Object to look for
		}
		_.extend(default_options, options);

		var logic_node_base = new app.InputNodeBase(default_options);
		if(!logic_node_base.target){
			if(options._randomize){
				logic_node_base.target = new app.ObjectTarget({
					type:[app.LogicFactory.random_value('inventory-object.type')]
				});
			}else{
				throw new Error("Invalid Object Type Passed in");
			}
		}

		logic_node_base.condition(function(data, cb){

			for(var i in logic_node_base.npc.inventory){

				if(logic_node_base.target.match(logic_node_base.npc.inventory[i])){
					//console.log("Found in inventory:" + logic_node_base.npc.inventory[i].type);
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
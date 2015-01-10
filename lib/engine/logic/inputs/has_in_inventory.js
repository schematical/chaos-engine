
module.exports = function(app){
	app.logic.inputs.HasInInventory = function(options){




		var default_options = {
			object_type:null//The Object to look for
		}
		_.extend(default_options, options);

		var logic_node_base = new app.InputNodeBase(options);

		logic_node_base.condition(function(data, cb){

				for(var i in logic_node_base.npc.inventory){
					if(logic_node_base.npc.inventory[i].type == logic_node_base.type){
						return this.outputNode().exec(
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
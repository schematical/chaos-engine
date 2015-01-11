
module.exports = function(app){
	app.logic.inputs.DefaultBehavior = function(options){
		options.type = 'DefaultBehavior';
		var logic_node_base = new app.InputNodeBase(options);
		//Get close tiles
		logic_node_base.condition(function(data, cb){
			//If NPC already has an output node for now then get out
			if(this.npc._actingOutputNode){
				return cb();
			}
			return this.trigger(
				{
					target:this
				},
				cb
			);



		});
		return logic_node_base;
	}
}
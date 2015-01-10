
module.exports = function(app){
	//THIS CAN ONLY HAPPEN BETWEEN TWO NPCS
	app.logic.inputs.Collide = function(options){
		var logic_node_base = new app.InputNodeBase(options);
		//This is irrelevant
		logic_node_base.condition(function(data, cb){ return cb(); });
		logic_node_base.npc.on('collision', function(event, data, cb){
			if(logic_node_base.target && !logic_node_base.target.match(data.target)){
				return cb();//The target does not match
			}
			logic_node_base.trigger(data, cb)
		})
		return logic_node_base;
	}
}
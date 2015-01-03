
module.exports = function(app){
	app.logic.outputs.Follow = function(options){
		var logic_node_base = new app.OutputNodeBase(options);
		logic_node_base.exe_function(function(cb){
			//Find your target npc

			//Move NPC tward it


		});
		return logic_node_base;
	}
}
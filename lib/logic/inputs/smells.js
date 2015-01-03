
module.exports = function(app){
	app.logic.inputs.Smell = function(options){
		var logic_node_base = new app.InputNodeBase(options);
		//Get close tiles
		logic_node_base.condition(function(cb){
			//Find all tiles close to the user

		});
		return logic_node_base;
	}
}
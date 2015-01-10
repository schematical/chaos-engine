
module.exports = function(app){
	app.logic.inputs.DefaultBehavior = function(options){
		var logic_node_base = new app.InputNodeBase(options);
		//Get close tiles
		logic_node_base.condition(function(cb){

			return this.outputNode().exec(
				{
					target:this
				},
				cb
			);

			//return cb();

		});
		return logic_node_base;
	}
}
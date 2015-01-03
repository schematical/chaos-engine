
module.exports = function(app){
	app.InputNodeBase = function(options){
		var default_options = {
			_condition:null,
			_outputNode:null
		}
		_.extend(options, default_options);

		var logic_node = new app.LogicNodeBase(options);

		logic_node.outputNode = function(){
			return this._outputNode;
		}


		logic_node.process = function(cb){
			this._condition(cb);
		}
		logic_node.condition = function(_condition){
			this._condition = _condition;
		};
		return logic_node;
	}
}
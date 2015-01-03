
module.exports = function(app){
	app.OutputNodeBase = function(options){
		var default_options = {
			_inputNode:null,
			_exe_function:null
		}
		_.extend(options, default_options);
		var logic_node = new app.OutputNodeBase(options);
		//Get close tiles
		logic_node.inputNode = function(){
			return this._inputNode;
		}
		logic_node.exe_function = function(_exe_function){
			this._exe_function = _exe_function;
		}

		return logic_node;
	}
}
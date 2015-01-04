var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.OutputNodeBase = function(options){
		var default_options = {
			_inputNode:null,
			_exe_function:null
		}
		_.extend(default_options, options);
		var logic_node = new app.LogicNodeBase(options);
		//Get close tiles
		logic_node.inputNode = function(){
			return this._inputNode;
		}
		logic_node.exe_function = function(_exe_function){
			this._exe_function = _exe_function;
		}
		logic_node.exec = function(data, cb){
			this._exe_function(data, cb);
		}

		return logic_node;
	}
}
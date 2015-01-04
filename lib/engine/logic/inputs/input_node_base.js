var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.InputNodeBase = function(options){
		var default_options = {
			_condition:null,
			_outputNode:null
		}
		_.extend(default_options, options);

		var logic_node = new app.LogicNodeBase(options);

		logic_node.outputNode = function(_outputNode){
			if(_outputNode){
				if(this._outputNode){
					throw new Error("Output node already set");
				}
				this._outputNode = _outputNode;
			}
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
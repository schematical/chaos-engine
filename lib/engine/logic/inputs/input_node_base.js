var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.InputNodeBase = function(options){
		var default_options = {
			_condition:null,
			_outputNode:null,
			_chainedInputNode:null
		}
		_.extend(default_options, options);

		var logic_node = new app.LogicNodeBase(options);

		logic_node.outputNode = function(_outputNode){
			if(_outputNode){
				if(this._outputNode){
					throw new Error("Output node already set");
				}
				if(this._chainedInputNode){
					throw new Error("Cannot set ouput when chained Input Node already set");
				}
				this._outputNode = _outputNode;
			}
			return this._outputNode;
		}
		logic_node.chainInput = function(_inputNode){
			if(_inputNode){
				if(this._outputNode){
					throw new Error("Cannot chain input when Output node already set");
				}
				if(this._chainedInputNode){
					throw new Error("Chained Input Node already set");
				}
				this._chainedInputNode = _inputNode;
			}
			return this._chainedInputNode;
		}
		logic_node.trigger = function(data, cb){
			if(this._outputNode){
				return this._outputNode.exec(data, cb);
			}
			if(this._chainedInputNode){
				return this._chainedInputNode.process(data, cb);
			}
		}

		logic_node.process = function(data, cb){
			this._condition(data, cb);
		}
		logic_node.condition = function(_condition){
			this._condition = _condition;
		};


		return logic_node;
	}
}
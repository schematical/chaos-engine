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
				}				if(this._chainedInputNode){
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
		logic_node.trigger = function(event, data, cb){
			this.exicuting = true;
			if(_.isFunction(data)){
				cb = data;
				data = event;
			}
			if(this._outputNode){
				return this._outputNode.exec(data, cb);
			}
			if(this._chainedInputNode){
				return this._chainedInputNode.process(data, cb);
			}
		}

		logic_node.process = function(data, cb){
			this.exicuting = false;
			if(this._outputNode){
				this._outputNode.resetCycle();
			}
			if(this._chainedInputNode){
				this._chainedInputNode.exicuting = false;
			}
			this._condition(data, cb);
		}
		logic_node.condition = function(_condition){
			this._condition = _condition;
		};


		//TODO: Serilize
		logic_node.serialize = function(){
			var ret = {};
			for(var prop in this){

				var prop_value = this[prop];
				if(prop_value){
					if(prop == '_chainedInputNode'){
						ret._chainedInputNode = this._chainedInputNode.serialize()
					}else if(prop == '_outputNode'){
						ret._outputNode = this._outputNode.serialize()
					}else if(prop == 'npc'){
						ret.npc = this.npc.id
					}else if(
						(this.hasOwnProperty(prop)) &&
						(!_.isFunction(prop_value))
					){

						if(prop_value && prop_value.id){
							prop_value = prop_value.id;
						}
						ret[prop] = prop_value;
					}
				}
			}
			return ret;
		}

		return logic_node;
	}
}
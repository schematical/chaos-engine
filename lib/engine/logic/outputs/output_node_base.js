"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.OutputNodeBase = class OutputNodeBase extends app.LogicNodeBase{
		constructor(options) {
			var default_options = {
				_inputNode: null,
				_exe_function: null,
				_success_function: null,//Evaluates if a OutputNode is a success
				_fail_function: null,//Evaluates if a OutputNode is a failure
				_success_node: null,
				_fail_node: null
			}
			_.extend(default_options, options);
			super(default_options);
		}
		//Get close tiles
		resetCycle(){
			this.exicuting = false;
			if(this._success_node){
				this._success_node.resetCycle();
			}
			if(this._fail_node){
				this._fail_node.resetCycle();
			}
		}
		inputNode(){
			return this._inputNode;
		}
		exe_function(_exe_function){
			this._exe_function = _exe_function;
		}
		success_node(_success_node){
			this._success_node = _success_node;
		}
		fail_node(_fail_node){
			this._fail_node = _fail_node;
		}
		/**
		 * Only the constructor should call this
		 * @param _success_function
		 */
		success_function (_success_function){
			this._success_function = _success_function;
		}
		/**
		 * Only the constructor should call this
		 * @param _fail_function
		 */
		fail_function(_fail_function){
			this._fail_function = _fail_function;
		}


		trigger_success(data, cb){

			if(!this._success_node){
				return cb();
			}

			return this._success_node.exec(data, cb);
		}
		trigger_fail(data, cb){
			if(!logic_node._fail_node){
				return cb();
			}
			return logic_node._fail_node.exec(data, cb);
		}
		exec(data, next){
			this.exicuting = true;
			this.npc._actingOutputNode = this;
			return this.exe_function(data, function(err){
				if(err) return next(err);
				return next(null, true);
			});
		}
		//TODO: Serilize
		serialize(){
			var ret = {};
			for(var prop in this){

				var prop_value = this[prop];
				if(prop_value){
					if(prop == '_fail_node'){
						ret._fail_node = this._fail_node.serialize()
					}else if(prop == '_success_node'){
						ret._success_node = this._success_node.serialize();
					}else if(prop == 'npc'){
						ret.npc = this.npc.id
					}else if(prop == 'target'){
						if(this.target._is_object_target){
							ret.target = this.target;
						}else if(this.target.id) {
							ret.target = { id: this.target.id }

							//<-- HAIL MARRY START HERE
						}else if(this.target.npc){
							ret.target = { npc: this.target.npc.id }

							//--> END HAIL MARY
						}else{
							console.error(this.target)
							console.error(this.type);
							throw new Error("Matt: The problem starts here. The target does not get properly serialized")
							/*console.log("Target:", Object.keys(this.target), this.target.type);
							ret.target = this.target;*/
						}
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

	}
}
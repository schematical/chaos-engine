"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Attack = function(options){
		var default_options = {
			type:'Attack'
		}
		_.extend( options, default_options);
		var logic_node_base = new app.OutputNodeBase(options);

		logic_node_base.exe_function(_.bind(function(data, cb){

			if(!data.target){
				console.error(data);
				throw new Error("No item to for " + this.npc.id + ' to interact with');
			}
			return this.npc.attack(data, cb);
			//return data.target.trigger('interact', { npc: this.npc }, cb);


		}, logic_node_base));
		return logic_node_base;
	}
}
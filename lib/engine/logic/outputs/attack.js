"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Attack = class Attack extends app.OutputNodeBase{
		constructor(options) {
			var default_options = {
				type: 'Attack'
			}
			_.extend(options, default_options);
			super(options);
		}
		exe_function(data, cb){

			if(!data.target){
				console.error(data);
				throw new Error("No item to for " + this.npc.id + ' to interact with');
			}
			return this.npc.attack(data, cb);
			//return data.target.trigger('interact', { npc: this.npc }, cb);
		}
	}
}
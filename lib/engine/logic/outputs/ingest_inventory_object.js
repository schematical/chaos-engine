"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.IngestInventoryObject = class IngestInventoryObject extends app.OutputNodeBase{
		constructor(options) {
			var default_options = {
				type: 'IngestInventoryObject'
			}
			_.extend(default_options, options);
			super(default_options);
		}

		exe_function(data, cb){

			//Find your target npc
			var target = data.target;
			if(!target || !target._is_inventory_object){

				return cb(new Error("Invalid Target Passed in:" + (target && target.id) || target))
			}
			data.object = data.target;
			if(!this.npc.inventory[data.object.id]){
				return cb(new Error("NPC attemptng to ingest something not in their inventory. Invalid Target Passed in:" + (target && target.id) || target));
			}
			return this.npc.ingest(data, cb);

		}
	}
}
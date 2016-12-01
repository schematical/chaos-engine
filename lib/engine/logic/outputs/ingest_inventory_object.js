"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.IngestInventoryObject = class IngestInventoryObject extends OutputNodeBase{
		constructor(options) {
			var default_options = {
				type: 'IngestInventoryObject'
			}
			_.extend(options, default_options);
			super(options);
		}

		exe_function(data, cb){

			//Find your target npc
			var target = data.target;
			if(!target || !target._is_inventory_object){

				return cb(new Error("Invalid Target Passed in:" + (target && target.id) || target))
			}
			data.object = data.target;
			return this.npc.ingest(data, cb);

		}
	}
}
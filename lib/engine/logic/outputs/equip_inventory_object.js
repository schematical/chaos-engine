"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.EquipInventoryObject = class EquipInventoryObject extends app.OutputNodeBase{
		constructor(options) {
			var default_options = {
				type: 'UseInventoryObject'
			}
			_.extend(options, default_options);
			super(options);
		}
		exe_function(data, cb){

			//Find your target npc
			var target = data.target;
			if(!target._is_inventory_object){
				//invalid target
				return cb()
			}
			return target.ingest(logic_node_base.npc, data, cb);


		}
	}
}
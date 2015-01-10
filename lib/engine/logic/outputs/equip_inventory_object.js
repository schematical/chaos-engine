var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.EquipInventoryObject = function(options){
		var default_options = {
			type:'UseInventoryObject'
		}
		_.extend( options, default_options);
		var logic_node_base = new app.OutputNodeBase(options);

		logic_node_base.exe_function(_.bind(function(data, cb){

			//Find your target npc
			var target = data.target;
			if(!target._is_inventory_object){
				//invalid target
				return cb()
			}
			return target.injest(logic_node_base.npc, data, cb);


		}, logic_node_base));
		return logic_node_base;
	}
}
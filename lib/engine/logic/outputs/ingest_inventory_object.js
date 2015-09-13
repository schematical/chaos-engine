var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.IngestInventoryObject = function(options){
		var default_options = {
			type:'IngestInventoryObject'
		}
		_.extend( options, default_options);
		var logic_node_base = new app.OutputNodeBase(options);

		logic_node_base.exe_function(_.bind(function(data, cb){

			//Find your target npc
			var target = data.target;
			if(!target || !target._is_inventory_object){

				return cb(new Error("Invalid Target Passed in:" + (target && target.id) || target))
			}

			return target.ingest(logic_node_base.npc, data, cb);


		}, logic_node_base));
		return logic_node_base;
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.InventoryObjectBase = function(options){
		var default_options = {
			weight: 1
		}
		_.extend(options, default_options);

		var inventory_object_base = new app.PhysicalObjectBase(options);
		inventory_object_base.on('interact', function(event, data, next){
			//Add yourself to player inventory
			data.npc.add_to_inventory(this);
			//Remove from world
		});
		return inventory_object_base;
	}
}
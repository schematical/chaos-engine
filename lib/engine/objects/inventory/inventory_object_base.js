var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.InventoryObjectBase = function(options){
		var default_options = {
			weight: 1,
			_is_inventory_object:true,
			on_injest:function(npc, data, next){
				//Most things are not meant to be injested so cause damage by default
				npc.health -= 50;
				return next();
			}
		}
		_.extend(options, default_options);

		var inventory_object_base = new app.PhysicalObjectBase(options);
		inventory_object_base.on('interact', function(event, data, next){

			//Add yourself to player inventory
			data.npc.add_to_inventory(this);
			//Remove from world
			this.detach();
			this.markUpdated();
		});
		inventory_object_base.injest = function(npc, data, next){
			npc.remove_from_inventory(inventory_object_base.id);
			return this.on_injest(npc, data, next);
		}
		return inventory_object_base;
	}
}
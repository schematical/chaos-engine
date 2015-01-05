var async = require('async');
var _ = require('underscore');

module.exports = function(app){
	app.objects.Water = function(options){
		var default_options = {
			type:'water',
			on_injest:function(npc, data, next){
				npc.health += 1;
			}
		}
		_.extend(default_options, options);

		var inventory_object_base = new app.InventoryObjectBase(default_options);

		return inventory_object_base;
	}
}
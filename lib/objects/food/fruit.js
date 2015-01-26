var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'food-fruit');
	app.LogicFactory.regester_value('inventory-object.type', 'food-bacon');
	app.objects.Fruit = function(options){
		var default_options = {
			type:'food-fruit',
			object_class:"Fruit",
			on_injest:function(npc, data, next){
				//Most things are not meant to be injested so cause damage by default
				npc.nourishment += 5;
				return next();
			}
		}
		_.extend(default_options, options);

		var inventory_object_base = new app.InventoryObjectBase(default_options);

		return inventory_object_base;
	}
}
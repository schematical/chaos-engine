var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'revolver');
	app.LogicFactory.regester_value('inventory-object.type', 'revolver');
	app.LogicFactory.regester_value('weapon.type', 'revolver');
	app.objects.Revolver = function(options){
		var default_options = {
			type:'revolver'
		}
		_.extend(default_options, options);

		var inventory_object_base = new app.InventoryObjectBase(default_options);

		return inventory_object_base;
	}
}
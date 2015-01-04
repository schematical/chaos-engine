var async = require('async');
var _ = require('underscore');

module.exports = function(app){
	app.objects.Gold = function(options){
		var default_options = {
			type:'gold'
		}
		_.extend(default_options, options);

		var inventory_object_base = new app.InventoryObjectBase(default_options);

		return inventory_object_base;
	}
}
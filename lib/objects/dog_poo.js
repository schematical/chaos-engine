var async = require('async');
var _ = require('underscore');
/**
 * TODO: Remember to program an AI that when given dog poo then imediatly drop it
 * @param app
 */
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'dog_poo');
	app.objects.DogPoo = function(options){
		var default_options = {
			type:'dog_poo',
			object_class:"DogPoo"
		}
		_.extend(default_options, options);

		var inventory_object_base = new app.InventoryObjectBase(default_options);

		return inventory_object_base;
	}
}
var async = require('async');
var _ = require('underscore');
/**
 * This produces a certain type of object
 * @param app
 */
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'fruit-factory');
	app.objects.food.FruitFactory = function(options){
		var default_options = {
			type:'fruit-factory',
			object_class:"FruitFactory",
			productionClass: app.objects.food.Fruit

		}
		_.extend(default_options, options);

		var factory_base = new app.objects.FactoryBase(default_options);

		return factory_base;
	}
}
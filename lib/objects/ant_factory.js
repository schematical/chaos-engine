var async = require('async');
var _ = require('underscore');
/**
 * This produces a certain type of object
 * @param app
 */
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'ant-factory');
	app.objects.AntFactory = function(options){
		var default_options = {
			type:'ant-factory',
			object_class:"AntFactory",
			productionClass: "Ant"

		}
		_.extend(default_options, options);

		var factory_base = new app.objects.FactoryBase(default_options);

		return factory_base;
	}
}
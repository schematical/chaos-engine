"use strict";
const _ = require('underscore');
/**
 * This produces a certain type of object
 * @param app
 */
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'gold-factory');
	app.objects.GoldFactory = class GoldFactory extends app.objects.FactoryBase{
		constructor (options) {
			var default_options = {
				type: 'gold-factory',
				object_class: "GoldFactory",
				productionClass: "Gold"

			}
			_.extend(default_options, options);

			super(default_options);
		}
	}
}
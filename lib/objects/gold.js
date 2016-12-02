"use strict";
const _ = require('underscore');

module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'gold');
	app.objects.Gold = class Gold extends app.InventoryObjectBase{
		constructor(options) {
			var default_options = {
				type: 'gold',
				object_class: "Gold"
			}
			_.extend(default_options, options);
			super(default_options);
		}
	}
}
"use strict";
const _ = require('underscore');

module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'water');
	app.objects.Water = class Water extends  app.InventoryObjectBase{
		constructor(options) {
			var default_options = {
				type: 'water',
				object_class: "Water"
			}
			_.extend(default_options, options);

			super(default_options);
		}
		on_ingest (npc, data, next) {
			npc.hydration += 10;
			return next()
		}
	}
}
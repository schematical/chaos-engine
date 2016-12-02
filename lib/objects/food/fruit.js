"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'food-fruit');
	app.LogicFactory.regester_value('inventory-object.type', 'food-bacon');
	app.objects.food.Fruit = class Fruit extends app.InventoryObjectBase{
		constructor(options){
			var default_options = {
				type:'food-fruit',
				object_class:"food.Fruit",
				on_ingest:function(npc, data, next){
					//Most things are not meant to be ingested so cause damage by default
					npc.nourishment += 50;
					//TODO: Add seed to inventory
					var product = new app.objects.food.FruitFactorySeed({
						id: this.id + '-seed',
						world: this.world
					});
					product.detach();
					npc.add_to_inventory(product);


					return next();
				}
			}
			_.extend(default_options, options);

			super(default_options);
		}
	}
}
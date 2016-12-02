"use strict";
const _ = require('underscore');
/**
 * This produces a certain type of object
 * @param app
 */
module.exports = function(app){
    app.LogicFactory.regester_value('object.type', 'fruit-factory-seed');
    app.objects.food.FruitFactorySeed = class FruitFactorySeed extends app.InventoryObjectBase {
        constructor(options) {
            var default_options = {
                type: 'fruit-factory-seed',
                object_class: "food.FruitFactorySeed"
            }
            _.extend(default_options, options);

            super(default_options);

        }

        /**
         * I dont remember how this works
         */
        plant(){

        }
    }
}

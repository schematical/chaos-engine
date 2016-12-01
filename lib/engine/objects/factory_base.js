"use strict";
const async = require('async');
const _ = require('underscore');
/**
 * This produces a certain type of object
 * @param app
 */
module.exports = function(app){
	//app.LogicFactory.regester_value('object.type', 'dog_poo');
	app.objects.FactoryBase = class FactoryBase extends app.PhysicalObjectBase{
		constructor(options){
			var default_options = {
				/*type:'dog_poo',
				 object_class:"DogPoo",*/
				productionCycle: 10,
				cycleProgress: 0,
				range: 1,
				production_ct: 0,
				productionClass: null,
				/**
				 * Determines if the factory should produce
				 */
				shouldProduce: function () {
					this.cycleProgress -= 1;
					if (this.cycleProgress <= 0) {
						this.onProduce();
						this.cycleProgress = this.productionCycle;
					}
				},
				onProduce: function () {
					if (!this.productionClass) {
						throw new Error("No valid 'productionClass' stored with FactoryBase")
					}
					var Class = app.Serializer.getObjectClass(this.productionClass);
					var product = new Class({
						id: this.id + '-product-' + this.production_ct,
						world: this.world
					});
					this.production_ct += 1;
					product.setXY(
						this.x + Math.round(Math.random() * this.range * 2) - this.range,
						this.y + Math.round(Math.random() * this.range * 2) - this.range
					);
					return product;
				}


			}
			_.extend(default_options, options);
			super(default_options);
			this.on('cycle_physics', function (event, data, next) {
				this.shouldProduce();
				return next();
			});
			this.on('serialize', function (event, data, cb) {
				data.productionCycle = this.productionCycle;
				data.cycleProgress = this.cycleProgress;
				data.range = this.range;
				data.production_ct = this.production_ct;
				data.productionClass = this.productionClass;

				return cb();
			});
			this.on('deserialize', function (event, data, cb) {
				this.productionCycle = data.productionCycle;
				this.cycleProgress = data.cycleProgress;
				this.range = data.range;
				this.production_ct = data.production_ct;
				this.productionClass = data.productionClass;

				return cb();
			});
		}
	}
}
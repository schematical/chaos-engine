var async = require('async');
var _ = require('underscore');
/**
 * This produces a certain type of object
 * @param app
 */
module.exports = function(app){
	//app.LogicFactory.regester_value('object.type', 'dog_poo');
	app.objects.FactoryBase = function(options){
		var default_options = {
			/*type:'dog_poo',
			object_class:"DogPoo",*/
			productionCycle:10,
			cycleProgress:0,
			range:1,
			production_ct:0,
			productionClass:null,
			/**
			 * Determines if the factory should produce
			 */
			shouldProduce:function(){
				this.cycleProgress -= 1;
				if(this.cycleProgress <= 0){
					this.onProduce();
					this.cycleProgress = this.productionCycle;
				}
			},
			onProduce:function(){
					var product = new this.productionClass({
						id: this.id + '-product-' + this.production_ct,
						world:this.world
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

		var factory_base = new app.PhysicalObjectBase(default_options);
		factory_base.on('cycle_physics', function(event, data, next){
			this.shouldProduce();
			return next();
		});
		return factory_base;
	}
}
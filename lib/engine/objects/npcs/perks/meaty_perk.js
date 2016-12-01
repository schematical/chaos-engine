"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.perks.MeatyPerk = class MeatyPerk extends  app.PerkBase {
		constructor(options) {
			var default_options = {}
			_.extend(default_options, options);
			super(default_options);
			this.npc.on('interact', function (event, data, next) {
				if (data.interaction_type == 'steal') {
					if (this.npc.is_dead) {
						//They cannot defend themselfs
					} else {
						//calc chances of success
					}
					//Assuming there is a success

					//TODO: Add specific filter for what kinds of things they are stealng
					for (var i in this.npc.inventory) {
						var item = this.npc.inventory[i];
						this.npc.remove_from_inventory(item);
						this.npc.logHistory('had ' + item.id + ' stolen by ' + data.npc.id);
						data.npc.logHistory('stole ' + item.id + ' from ' + this.npc.id);
						data.npc.add_to_inventory(item)
					}

				}
				return next();
			});

			this.npc.on('death', function (event, data, next) {
				//if not starved create meat and add it to inventory
				if (this.npc.nourishment > 0) {
					var food = new app.objects.food.Bacon({
						id: this.id + '-flesh-' + 1,
						world: this.npc.world
					});

					this.npc.add_to_inventory(food);
				}
				return next();
			});
		}
	}
}


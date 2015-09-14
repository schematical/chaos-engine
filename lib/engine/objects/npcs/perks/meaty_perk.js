var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.perks.MeatyPerk = function(options){
		var default_options = {}
		_.extend(default_options, options);
		var perk_base = new app.PerkBase(default_options);
		perk_base.npc.on('interact', function(event, data, next) {
			if (data.interaction_type == 'steal') {
				if(perk_base.npc.is_dead){
					//They cannot defend themselfs
				}else{
					//calc chances of success
				}
				//Assuming there is a success

				//TODO: Add specific filter for what kinds of things they are stealng
				for(var i in perk_base.npc.inventory){
					var item = perk_base.npc.inventory[i];
					perk_base.npc.remove_from_inventory(item);
					perk_base.npc.logHistory('had ' + item.id + ' stolen by ' + data.npc.id);
					data.npc.logHistory('stole ' + item.id + ' from ' + perk_base.npc.id);
					data.npc.add_to_inventory(item)
				}

			}
			return next();
		});

		perk_base.npc.on('death', function(event, data, next){
			//if not starved create meat and add it to inventory
			if(	perk_base.npc.nourishment > 0){
				var food = new app.objects.food.Bacon({
					id:this.id + '-flesh-' + 1,
					world:	perk_base.npc.world
				});

				perk_base.npc.add_to_inventory(food);
			}
			return next();
		});
		return perk_base;
	}
}


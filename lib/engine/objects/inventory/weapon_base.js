
module.exports = function(app){
	app.WeaponBase = function(options){
		var default_options = {
			max_damage:1,
			min_damage:1,
			range:1,
			accuracy:1,
			on_use_attack:function(npc, data, next){
				if(!data.target){
					return next();
				}
				//Calculate min and max damage
				return next();
			}
		}


		_.extend(default_options, options);

		var weapon_base = new app.InventoryObjectBase(default_options);
		return weapon_base;
	}
}
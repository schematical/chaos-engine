var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.LogicFactory.regester_value('object.type', 'teeth');
	app.LogicFactory.regester_value('inventory-object.type', 'teeth');
	app.LogicFactory.regester_value('weapon.type', 'teeth');
	app.objects.Teeth = function(options){
		var default_options = {
			type:'teeth',
			min_damage:1,
			max_damage:10,
			object_class:"Teeth"
		}
		_.extend(default_options, options);

		var weapon_base = new app.WeaponBase(default_options);
		//Should depend on NPC's stats
		/**
		 *
		 * @param npc the NPC attacking
		 * @param data
		 * @param next
		 */
		weapon_base.on_use_attack = function(attacking_npc, data, next){
			var target = data.target;
			if(!target || !target._is_npc){
				return next(new Error("Cannot attack a non NPC object:" + target.id));
			}
			var range = this.max_damage - this.min_damage;
			var damage = this.min_damage + Math.round(Math.random() * range);
			var data =  {
				damage:damage,
				type:'melee'
			}
			target.recive_attack(attacking_npc, data, next);
		}
		return weapon_base;
	}
}
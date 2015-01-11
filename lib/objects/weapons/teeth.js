var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.objects.Teeth = function(options){
		var default_options = {
			type:'teeth',
			min_damage:1,
			max_damage:10
		}
		_.extend(default_options, options);

		var weapon_base = new app.WeaponBase(default_options);
		//Should depend on NPC's stats
		return weapon_base;
	}
}
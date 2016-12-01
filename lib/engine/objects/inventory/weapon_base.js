"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.WeaponBase = class WeaponBase extends app.InventoryObjectBase{
		constructor(options) {
			var default_options = {
				max_damage: 1,
				min_damage: 1,
				range: 1,
				accuracy: 1,
				on_use_attack: function (npc, data, next) {
					if (!data.target) {
						return next();
					}
					//Calculate min and max damage
					return next();
				}
			}


			_.extend(default_options, options);

			super(default_options);
		}
	}
}
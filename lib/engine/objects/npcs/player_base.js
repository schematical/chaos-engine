"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
 	app.npcs.PlayerBase = class PlayerBase extends app.NPCBase{
		constructor(options) {
			var default_options = {
				npc_class: 'PlayerBase',
				race: 'human',
				type: 'player-1',
				gender: 'm'
			}
			_.extend(default_options, options);

			super(default_options);

		}
		cycle(cb) {
			return cb();
		}
	}
}
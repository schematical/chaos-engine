"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Interact = class Interact extends OutputNodeBase{
		constructor(options) {
			var default_options = {
				type: 'Interact'
			}
			_.extend(default_options, options);
			super(default_options);
			if (options._randomize) {
				if (!this.interaction_type) {
					this.interaction_type = app.LogicFactory.random_value('interaction.type');
				}
			}
		}
		exe_function(data, cb) {

			if (!data.target) {
				return cb(new Error("No item to for " + this.npc.id + ' to interact with'));
			}
			var target_data = {npc: this.npc};
			if (this.interaction_type) {
				target_data.interaction_type = this.interaction_type;
			}
			return data.target.trigger('interact', target_data, cb);

		}
	}
}
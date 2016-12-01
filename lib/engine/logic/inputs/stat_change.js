"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.logic.inputs.StatChange = class StatChange extends app.InputNodeBase{
		constructor(options) {
			if (!options || !options.watch) {
				if (options._randomize) {

				} else {

					throw new Error("Invalid Stat to Watch");
				}
			}

			var default_options = {
				type: 'StatChange',
				_delta_amplitude: null,//Leaving null will trigger on any
				_delta_duration: null,//Leaving null will trigger on any
				tipping_point: null,
				compairison: null,
				watch: null,//The variable to watch,
				watch_function: null
			}
			_.extend(default_options, options);

			super(default_options);

			this._last_value = null;

			if (!_.isFunction(this.watch)) {
				var watch_var = this.watch;
				this.watch_function = function () {
					return this.npc[watch_var];
				}
			} else {
				throw new Error("This wont serilaize. Figure this out before continuing")
				this.watch_function = this.watch;
			}
		}
		condition(data, cb){
			//Yay
			var watch_value = this.watch_function();
			if(this._last_value){
				var has_changed = false;
				//console.log(watch_value, this.compairison, this.tipping_point)
				if(this.tipping_point && this.compairison){
					if(this.compairison == '<'){
						has_changed = watch_value < this.tipping_point;
					}else if(this.compairison == '>'){
						has_changed = watch_value > this.tipping_point;
					}else{
						throw new Error("Invalid compairison: " + this.compairison);
					}
				}else{
					has_changed = this._last_value === watch_value
				}

				if(has_changed){
					this._last_value = watch_value;
					return this.trigger(
						{
							last_value: this._last_value,
							new_value:watch_value
						},
						cb
					);
				}


			}else{
				this._last_value = watch_value;

			}
			return cb();

		}
	}
}
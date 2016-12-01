"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Explore = class Explore extends app.OutputNodeBase{
		constructor(options) {
			var default_options = {
				type: 'Explore',
				direction_duration_min: 0,
				direction_duration_max: 10,
				step_ct: 0,
				direction: null,
				direction_duration: null
			}
			_.extend(options, default_options);
			super(options);
		}
		get dir_arr() {
			return [
				'up',
				'down',
				'left',
				'right'
			];
		}
		exe_function(data, cb){
			if(!this.direction || this.step_ct > this.direction_duration){
				this.step_ct = 0;
				var dir_choice = Math.floor(Math.random() * 4);
				this.direction = this.dir_arr[dir_choice];
				this.direction_duration = Math.floor(Math.random() * (this.direction_duration_max - this.direction_duration_min)) + this.direction_duration_min;
			}


			switch(this.direction){
				case('up'):
					this.npc.walk.up();
				break;
				case('down'):
					this.npc.walk.down();
				break;
				case('left'):
					this.npc.walk.left();
				break;
				case('right'):
					this.npc.walk.right();
				break;
			}
			this.step_ct += 1;
			return cb();
		}
	}
}
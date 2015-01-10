var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Explore = function(options){
		var dir_arr = [
			'up',
			'down',
			'left',
			'right'
		];
		var default_options = {
			direction_duration_min:0,
			direction_duration_max:10,
			step_ct:0,
			direction:null,
			direction_duration:null
		}
		_.extend( options, default_options);
		var logic_node_base = new app.OutputNodeBase(options);

		logic_node_base.exe_function(_.bind(function(data, cb){
			if(!logic_node_base.direction || logic_node_base.step_ct > logic_node_base.direction_duration){
				logic_node_base.step_ct = 0;
				var dir_choice = Math.floor(Math.random() * 4);
				logic_node_base.direction = dir_arr[dir_choice];
				logic_node_base.direction_duration = Math.floor(Math.random() * (logic_node_base.direction_duration_max - logic_node_base.direction_duration_min)) + logic_node_base.direction_duration_min;
			}


			switch(logic_node_base.direction){
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
			logic_node_base.step_ct += 1;
			return cb();

		}, logic_node_base));
		return logic_node_base;
	}
}
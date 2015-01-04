var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Follow = function(options){
		var default_options = {
			distance:1
		}
		_.extend( options, default_options);
		var logic_node_base = new app.OutputNodeBase(options);

		logic_node_base.exe_function(_.bind(function(data, cb){

			//Find your target npc
			var target = data.target;
			//Find Goal x
			var x_range =  this.npc.x - target.x;
			var goal_x = this.npc.x;
			if(x_range > this.distance){
				goal_x -= 1;
			}else if(x_range < (this.distance * -1)){
				goal_x += 1;
			}
			var y_range =  this.npc.y - target.y;
			var goal_y = this.npc.y;
			if(y_range > this.distance){
				goal_y -= 1;
			}else if(y_range < (this.distance * -1)){
				goal_y += 1;
			}
			//console.log("Found NPC in range", goal_x, this.npc.x , goal_y , this.npc.y );
			if(goal_x != this.npc.x || goal_y != this.npc.y){
				this.npc.setXY(goal_x, goal_y);
			}

			//Move NPC tward it
			return cb();

		}, logic_node_base));
		return logic_node_base;
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Evade = function(options){
		var default_options = {
			type:'Evade',
			distance:4
		}
		_.extend( options, default_options);
		var logic_node_base = new app.OutputNodeBase(options);

		logic_node_base.exe_function(_.bind(function(data, cb){

			//Find your target npc
			var target = data.target;
			if(!data.target){
				return cb(new Error("No Target Passed in to Evade"));
			}
			//Find Goal x
			var x_range =  this.npc.x - target.x;

			if(x_range > this.distance){
				this.npc.walk.right();
			}else if(x_range < (this.distance * -1)){
				this.npc.walk.left();
			}
			var y_range =  this.npc.y - target.y;

			if(y_range > this.distance){
				this.npc.walk.down();
			}else if(y_range < (this.distance * -1)){
				this.npc.walk.up();
			}
			//console.log("Found NPC in range", goal_x, this.npc.x , goal_y , this.npc.y );


			//Move NPC tward it
			return cb();

		}, logic_node_base));
		return logic_node_base;
	}
}
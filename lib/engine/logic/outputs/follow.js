var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Follow = function(options){
		var default_options = {
			distance:1,
			type:'Follow'
		}
		_.extend(default_options, options);
		var logic_node_base = new app.OutputNodeBase(default_options);

		logic_node_base.exe_function(_.bind(function(data, cb){
			//console.log(this.npc.id, ' following ', data.target.id);
			//Find your target npc
			var target = data.target;
			this.target = target;
			//Move NPC tward it
			//Find Goal x
			var x_range =  this.npc.x - target.x;

			if(x_range > this.distance){
				this.npc.walk.left();
			}else if(x_range < (this.distance * -1)){
				this.npc.walk.right();
			}
			var y_range =  this.npc.y - target.y;

			if(y_range > this.distance){
				this.npc.walk.up();
			}else if(y_range < (this.distance * -1)){
				this.npc.walk.down();
			}
			//console.log("Found NPC in range", target.x, target.y );

			if(
				(Math.abs(x_range) <= 1) &&
				(Math.abs(y_range) <= 1)
			){

				//Trigger success
				return this.trigger_success({
					target: target
				}, cb);
			}

			return cb();

		}, logic_node_base));
		return logic_node_base;
	}
}
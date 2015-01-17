var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.outputs.Interact = function(options){
		var default_options = {
			type:'Interact'
		}
		_.extend(default_options, options);
		var logic_node_base = new app.OutputNodeBase(default_options);
		if(options._randomize){
			if(!logic_node_base.interaction_type){
				logic_node_base.interaction_type = app.LogicFactory.random_value('interaction.type');
			}
		}
		logic_node_base.exe_function(_.bind(function(data, cb){

			if(!data.target){
				return cb(new Error("No item to for " + this.npc.id + ' to interact with'));
			}
			var target_data = { npc: this.npc };
			if(this.interaction_type){
				target_data.interaction_type = this.interaction_type;
			}
			return data.target.trigger('interact', target_data, cb);


		}, logic_node_base));
		return logic_node_base;
	}
}
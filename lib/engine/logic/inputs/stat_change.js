var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.logic.inputs.StatChange = function(options){
		if(!options || !options.watch){
			if(options._randomize){

			}else{

				throw new Error("Invalid Stat to Watch");
			}
		}

		var default_options = {
			type:'StatChange',
			_delta_amplitude: null,//Leaving null will trigger on any
			_delta_duration: null,//Leaving null will trigger on any
			tipping_point:null,
			compairison:null,
			watch:null,//The variable to watch,
			watch_function:null
		}
		_.extend(default_options, options);

		var logic_node_base = new app.InputNodeBase(default_options);

		logic_node_base._last_value = null;

		if(!_.isFunction(logic_node_base.watch)){
			var watch_var = logic_node_base.watch;
			logic_node_base.watch_function = function(){
				return logic_node_base.npc[watch_var];
			}
		}else{
			throw new Error("This wont serilaize. Figure this out before continuing")
			logic_node_base.watch_function = logic_node_base.watch;
		}
		logic_node_base.condition(function(data, cb){
			//Yay
			var watch_value = logic_node_base.watch_function();
			if(logic_node_base._last_value){
				var has_changed = false;
				//console.log(logic_node_base.tipping_point, logic_node_base.compairison, watch_value)
				if(logic_node_base.tipping_point && logic_node_base.compairison){
					if(logic_node_base.compairison == '<'){
						has_changed = logic_node_base.tipping_point > watch_value;
					}else if(logic_node_base.compairison == '>'){
						has_changed = logic_node_base.tipping_point < watch_value;
					}else{
						throw new Error("Invalid compairison: " + logic_node_base.compairison);
					}
				}else{
					has_changed = logic_node_base._last_value === watch_value
				}

				if(has_changed){
					logic_node_base._last_value = watch_value;
					return this.trigger(
						{
							last_value: logic_node_base._last_value,
							new_value:watch_value
						},
						cb
					);
				}


			}else{
				logic_node_base._last_value = watch_value;

			}
			return cb();

		});
		return logic_node_base;
	}
}
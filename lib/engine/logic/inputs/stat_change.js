
module.exports = function(app){
	app.logic.inputs.StatChange = function(options){
		if(!options || !options.watch){
			throw new Error("Invalid Stat to Watch");
		}

		var default_options = {
			type:'StatChange',
			_delta_amplitude: null,//Leaving null will trigger on any
			_delta_duration: null,//Leaving null will trigger on any
			watch:null//The variable to watch
		}
		_.extend(default_options, options);

		var logic_node_base = new app.InputNodeBase(default_options);

		logic_node_base._last_value = null;

		if(!_.isFunction(logic_node_base.watch)){
			var watch_var = logic_node_base.watch;
			logic_node_base.watch = function(){
				return logic_node_base.npc[watch_var];
			}
		}
		logic_node_base.condition(function(data, cb){
			//Yay
			var watch_value = logic_node_base.watch();
			if(logic_node_base._last_value){

				if(logic_node_base._last_value === watch_value){
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
				return cb();
			}

		});
		return logic_node_base;
	}
}
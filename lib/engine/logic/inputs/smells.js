
module.exports = function(app){
	app.logic.inputs.Smell = function(options){
		options.type = 'Smell';
		var logic_node_base = new app.InputNodeBase(options);
		//Get close tiles

		if(!logic_node_base.target){
			if(options._randomize){
				logic_node_base.target = app.LogicFactory.random_target();
			}else{
				throw new Error("Invalid Object Type Passed in");
			}
		}

		logic_node_base.condition(function(data, cb){
			//Find all tiles close to the user
			/*for(var x = (this.npc.x - this.range); x < (this.npc.x + this.range); x++){
				for(var y = (this.npc.y - this.range); x < (this.npc.y + this.range); y++){
					var tile = this.npc.world.getTile(x, y);
					if(tile){
						//Cycle through objects to Match NPC
					}
				}
			}*/
			if(!this.target || !this.target.match){
				console.error(this.target)
				throw Error("Invalid target");
				return cb();
			}
			for(var i in this.npc.world.objects){
				var target_canidate = this.npc.world.objects[i];

				if(
					(!target_canidate.is_detached()) &&
					(target_canidate.x > (this.npc.x - this.range)) &&
					(target_canidate.x < (this.npc.x + this.range)) &&
					(target_canidate.y > (this.npc.y - this.range)) &&
					(target_canidate.y < (this.npc.y + this.range)) &&
					(target_canidate.id != this.npc.id) &&
					(this.target.match(target_canidate))
				){
					//Yay
					return this.trigger(
						{
							target:target_canidate
						},
						cb
					);
				}

			}
			return cb();

		});
		return logic_node_base;
	}
}
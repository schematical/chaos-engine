"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.logic.inputs.Senses = class Senses extends app.InputNodeBase{
		constructor(options) {

			options.type = 'Senses';
			super(options);

			if (!this.target) {
				if (options._randomize) {
					this.target = app.LogicFactory.random_target();
				} else {
					throw new Error("Invalid Object Type Passed in");
				}
			}
		}
		//Get close tiles
		condition(data, cb){
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

		}
	}
}
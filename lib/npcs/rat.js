
module.exports = function(app){
	app.Rat = function(options){
		options.type = 'rat';
		options.race = 'rat';
		options.nourishment = 40;
		options.health = 10;
		var npc_base = new app.NPCBase(options);

		app.LogicFactory.survival_101(npc_base);



		/*var evade = new app.logic.outputs.Evade({
			npc:npc_base
		});
		//Evade everyone
		var smell_evade = new app.logic.inputs.Smell({
			npc:npc_base,
			range:10,
			target: new app.NPCTarget({
				*//* HOW ever you select pretty much anything *//*
				selector:'*'
			})
		});
		smell_evade.outputNode(evade);
		npc_base.addLogicNode(smell_evade);*/

		var explore = new app.logic.outputs.Explore({
			npc:npc_base
		});
		var default_explore = new app.logic.inputs.DefaultBehavior({
			npc:npc_base,
			range:10,
			target: this
		});
		default_explore.outputNode(explore);
		npc_base.addLogicNode(default_explore);
		/** TODO Move to animal base or soemthing */
		npc_base.on('death', function(event, data, next){
			//if not starved create meat and add it to inventory
			if(npc_base.nourishment > 0){
				var food = new app.objects.food.Bacon({
					id:this.id + '-flesh-' + 1,
					world:npc_base.world
				});

				npc_base.add_to_inventory(food);
			}
			return next();
		});
		npc_base.on('collision', function(event, data, next){
			console.log("You stole my lucky charms");
			return next();
		})
		npc_base.cycle_log = function(){
			return;
			var target_id = this._actingOutputNode.target && this._actingOutputNode.target.id;
			console.log(
				this._actingOutputNode.type,
				target_id,
				Object.keys(this.inventory).length,
				's:' + this.state,
				'x:' + this.x,
				'y:' + this.y,
				'N:' + this.nourishment,
				'E:' + this.energy,
				'H:' + this.health
			);

		}
		return npc_base;
	}
}
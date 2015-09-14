
module.exports = function(app){
	app.npcs.Rat = function(options){
		options.npc_class = 'Rat';
		options.type = 'rat';
		options.race = 'rat';
		options.nourishment = 40;
		options.health = 50;

		var npc_base = new app.NPCBase(options);
		npc_base.spawn = function(){
			npc_base.biology.life_peak = 100;
			npc_base.biology.reproduction_age = 30;
			npc_base.biology.nourishment_capacity = 40;//The point where an NPC actually starts to take damage
			var quadriped = new app.perks.QuadripedBasePerk({ npc: npc_base });
			app.LogicFactory.survival_101(npc_base);
			app.LogicFactory.herbavore(npc_base);

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


		}
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
			//console.log("You stole my lucky charms");
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
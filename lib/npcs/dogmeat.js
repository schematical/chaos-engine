
module.exports = function(app){
	app.Dogmeat = function(options){
		options.type = 'dogmeat';
		options.race = 'dog';
		var npc_base = new app.NPCBase(options);
		var quadriped = new app.perks.QuadripedBasePerk({ npc: npc_base });
		app.LogicFactory.carnivore(npc_base);
		/**
		 * Follow people like a loyal dog
		 * @type {.logic.outputs.Follow}
		 */
		var follow = new app.logic.outputs.Follow({
			npc:npc_base
		});
		var smell_follow = new app.logic.inputs.Smell({
			npc:npc_base,
			range:5,
			target: new app.NPCTarget({
				/* HOW ever you select pretty much anything */
				race:'human'
			})
		});
		smell_follow.outputNode(follow);
		npc_base.addLogicNode(smell_follow);

		npc_base.on('collision', function(event, data, next){
			console.log("Arfff");
			return next();
		});
		npc_base.cycle_log = function(){
			if(!this._actingOutputNode){
				return;
			}
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
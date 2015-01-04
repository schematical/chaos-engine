
module.exports = function(app){
	app.TheLepricon = function(options){
		options.type = 'the_leprecon';
		var npc_base = new app.NPCBase(options);
		var evade = new app.logic.outputs.Evade({
			npc:npc_base
		});
		//Evade everyone
		var smell_evade = new app.logic.inputs.Smell({
			npc:npc_base,
			range:10,
			target: new app.NPCTarget({
				/* HOW ever you select pretty much anything */
				selector:'*'
			})
		});
		smell_evade.outputNode(evade);
		npc_base.addLogicNode(smell_follow);

		npc_base.on('collision', function(event, data, next){
			console.log("You stole my lucky charms");
			return next();
		})
		return npc_base;
	}
}
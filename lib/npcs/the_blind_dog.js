
module.exports = function(app){
	app.TheBlindDog = function(options){
		options.type = 'the_blind_dog';
		var npc_base = new app.NPCBase(options);
		var follow = new app.logic.outputs.Follow({
			npc:npc_base
		});
		var smell_follow = new app.logic.inputs.Smell({
			npc:npc_base,
			range:5,
			target: new app.NPCTarget({
				/* HOW ever you select pretty much anything */
				selector:'*'
			})
		});
		smell_follow.outputNode(follow);
		npc_base.addLogicNode(smell_follow);

		npc_base.on('collision', function(event, data, next){
			console.log("Arfff");
			return next();
		})
		return npc_base;
	}
}

module.exports = function(app){
	app.TheBlindDog = function(options){
		options.type = 'the_blind_dog';
		var npc_base = new app.NPCBase(options);

		npc_base.addLogicNode()
		return npc_base;
	}
}

module.exports = function(app){
	app.TheBlindDog = function(options){
		options.type = 'the_blind_dog';
		var npc_base = new app.NPCBase(options);

		npc_base.cycle = function(cb){
			//Eventually run through setup logic
			//Find Nearest
			return cb();
		}
		return npc_base;
	}
}
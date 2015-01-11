
module.exports = function(app){
	app.perks.QuadripedBasePerk = function(options){
		if(!options.npc){
			throw new Error('Need an npc set');
		}


		var _Human = new app.PerkBase(options);
		var teeth = new app.objects.Teeth({ world: npc.world });
		options.npc.add_to_inventory(teeth);
		options.npc.equipped_slots = {
			head:teeth
		}
		return _Human;
	}
}
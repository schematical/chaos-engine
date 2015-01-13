
module.exports = function(app){
	app.perks.QuadripedBasePerk = function(options){
		if(!options.npc){
			throw new Error('Need an npc set');
		}
		options.perk_class = 'QuadripedBasePerk';

		var perk_base = new app.PerkBase(options);
		var teeth = new app.objects.Teeth({
			id: options.npc.id + '-teeth',
			world: options.npc.world
		});
		options.npc.add_to_inventory(teeth);
		options.npc.equipped_slots = {
			head:teeth
		}
		return perk_base;
	}
}
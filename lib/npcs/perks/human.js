
module.exports = function(app){
	app.perks.HumanBasePerk = function(options){
		if(options.npc){
			throw new Error('Need an npc set');
		}
		options.npc.equipped_slots = {
			right_hand:null,
			left_hand:null,
			head:null,
			feet:null,
			chest:null
		}
		var _Human = new app.PerkBase(options);
		return _Human;
	}
}
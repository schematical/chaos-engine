
module.exports = function(app){
	require('./player_base')(app);
	require('./npc_base')(app);
	require('./perk_base')(app);
}
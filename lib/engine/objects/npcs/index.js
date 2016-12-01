
module.exports = function(app){
	app.npcs = {};
	require('./npc_base')(app);
	require('./player_base')(app);
	require('./perks')(app);
}
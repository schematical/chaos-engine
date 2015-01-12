
module.exports = function(app){
	app.npcs = {};
	require('./player_base')(app);
	require('./npc_base')(app);
	require('./perks')(app);
}
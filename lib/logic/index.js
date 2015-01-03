
module.exports = function(app){
	app.logic = {
		inputs:{},
		outputs:{}
	}
	require('./logic_factory')(app);
	require('./logic_node_base')(app);
	require('./npc_target')(app);
}
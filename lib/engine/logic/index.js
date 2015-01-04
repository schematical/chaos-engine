
module.exports = function(app){
	app.logic = {
		inputs:{},
		outputs:{}
	}
	require('./logic_factory')(app);
	require('./logic_node_base')(app);
	require('./npc_target')(app);


	require('./inputs/input_node_base')(app);
	require('./inputs/smells')(app);

	require('./outputs/output_node_base')(app);
	require('./outputs/follow')(app);
}
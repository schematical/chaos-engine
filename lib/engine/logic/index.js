
module.exports = function(app){
	app.logic = {
		inputs:{},
		outputs:{}
	}
	require('./logic_factory')(app);
	require('./logic_node_base')(app);
	require('./npc_target')(app);
	require('./object_target')(app);


	require('./inputs/input_node_base')(app);
	require('./inputs/smells')(app);
	require('./inputs/stat_change')(app);
	require('./inputs/default_behavior')(app);
	require('./inputs/has_in_inventory')(app);
	require('./inputs/collide')(app);


	require('./outputs/output_node_base')(app);
	require('./outputs/follow')(app);
	require('./outputs/evade')(app);
	require('./outputs/explore')(app);
	require('./outputs/interact')(app);
	require('./outputs/attack')(app);
	require('./outputs/ingest_inventory_object')(app);

}
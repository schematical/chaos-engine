
module.exports = function(app){
	app.objects = {};
	require('./object_base')(app);
	require('./physical_object_base')(app);
	require('./factory_base')(app);
	require('./npcs')(app);
	require('./inventory')(app);
}
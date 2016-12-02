
module.exports = function(app){
	require('./weapons/beretta')(app);
	require('./weapons/revolver')(app);
	require('./weapons/teeth')(app);

	app.objects.food = {}
	require('./food/bacon')(app);
	require('./food/fruit')(app);
	require('./food/fruit_factory')(app);
	require('./food/fruit_factory_seed')(app);

	require('./ant_factory')(app);


	require('./gold')(app);
	require('./gold_factory')(app);

	require('./water')(app);
}
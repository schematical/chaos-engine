
module.exports = function(app){
	require('./weapons/beretta')(app);
	require('./weapons/revolver')(app);
	require('./weapons/teeth')(app);

	app.objects.food = {}
	require('./food/bacon')(app);
	require('./food/fruit')(app);
}
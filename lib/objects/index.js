
module.exports = function(app){
	require('./weapons/beretta')(app);
	require('./weapons/revolver')(app);

	app.objects.food = {}
	require('./food/bacon')(app);
	require('./food/fruit')(app);
}
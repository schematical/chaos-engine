
module.exports = function(app){
	require('./engine')(app);

	require('./enum')(app);
	require('./game')(app);
	require('./world')(app);
	require('./npcs')(app);

	require('./objects')(app);


	require('./modules')(app);
	require('./routes')(app);
}
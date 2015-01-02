
module.exports = function(app){
	require('./modules')(app);
	require('./engine')(app);
	require('./user')(app);
	require('./world')(app);
	require('./tile_base')(app);
	require('./objects')(app);



	require('./game')(app);
}
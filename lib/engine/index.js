
module.exports = function(app){
	require('./engine')(app);
	require('./logic')(app);
	require('./user')(app);
	require('./world_base')(app);
	require('./tile_base')(app);
	require('./objects')(app);





}

module.exports = function(app){
	require('./engine')(app);
	require('./logic')(app);
	require('./user')(app);
	require('./world/world_base')(app);
	require('./tile_base')(app);
	require('./serializer')(app);
	require('./objects')(app);





}
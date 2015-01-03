
module.exports = function(app){
	require('./object_base')(app);
	require('./physical_object_base')(app);
	require('./npcs')(app);
}
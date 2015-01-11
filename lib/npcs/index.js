
module.exports = function(app){
	require('./dogmeat')(app);
	require('./rat')(app);

	require('./perks')(app);
}
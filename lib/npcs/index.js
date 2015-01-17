
module.exports = function(app){
	require('./dogmeat')(app);
	require('./rat')(app);
	require('./ant')(app);

	require('./perks')(app);
}
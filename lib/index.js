
module.exports = function(app){
	require('./modules')(app);

	require('./world')(app);
	require('./objects')(app);
}
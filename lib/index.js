
module.exports = function(app){
	require('./engine')(app);


	require('./game')(app);
	require('./world')(app);
}
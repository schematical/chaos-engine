
module.exports = function(app){
	app.races = {};
	require('./human')(app);
}
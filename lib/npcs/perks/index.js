
module.exports = function(app){
	app.perks = {};
	require('./human')(app);
	require('./quadriped')(app);
}
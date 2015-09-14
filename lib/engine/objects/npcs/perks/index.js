
module.exports = function(app){
	app.perks = {};
	require('./perk_base')(app);
	require('./female_perk')(app);
	require('./male_perk')(app);
	require('./meaty_perk')(app);
}
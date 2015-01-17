
module.exports = function(app){
	app.schema = {};
	app.Mongoose = require('mongoose');
	app.Mongoose.connect('mongodb://localhost/chaos_engine');
	require('./world')(app);
	require('./world_object')(app);
}
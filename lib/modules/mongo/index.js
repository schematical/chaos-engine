
module.exports = function(app){
	app.schema = {};
	app.Mongoose = require('mongoose');
	app.Mongoose.connect('mongodb://localhost/wheezy');
}
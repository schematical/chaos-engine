
module.exports = function(app){
	app.Mongoose = require('mongoose');
	app.Mongoose.connect('mongodb://localhost/wheezy');
}
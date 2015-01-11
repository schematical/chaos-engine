var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.RaceBase = function(options){
		_.extend(options, this);
		return this;
	}
}
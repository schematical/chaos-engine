var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.PerkBase = function(options){
		_.extend(options, this);
		return this;
	}
}
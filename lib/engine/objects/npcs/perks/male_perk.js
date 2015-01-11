var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.perks.MalePerk = function(options){
		var default_options = {}
		_.extend(default_options, options);
		var perk_base = new app.PerkBase(default_options);

		return perk_base;
	}
}
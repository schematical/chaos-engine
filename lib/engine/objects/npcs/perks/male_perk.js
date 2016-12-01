"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.perks.MalePerk = class MalePerk extends app.PerkBase {
		constructor(options) {
			var default_options = {}
			_.extend(default_options, options);
			super(default_options);
		}
	}
}
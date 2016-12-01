"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.PerkBase = class PerkBase {
		constructor(options) {
			_.extend(this, options);
		}
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	/**
	 * I have no idea but this seems like a cool way to build a selector for NPC's in a range
	 */

	app.ObjectTarget = function(options){
		_.extend(this, options);
		if(_.isString(this.type)){
			this.type = [this.type];
		}

		return this;
	}
	app.ObjectTarget.prototype.match = function(object){
		var valid_object = false;
		if(_.contains(this.type, object.type)){
			//Match all
			valid_object = true;
		}
		return valid_object;
	}
}
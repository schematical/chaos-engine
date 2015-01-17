var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	/**
	 * I have no idea but this seems like a cool way to build a selector for NPC's in a range
	 */

	app.ObjectTarget = function(options){
		_.extend(this, options);
		if(options.gender || options.race){
			throw new Error("Did you mean to use NPCTarget?");
		}
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
	app.ObjectTarget.prototype.toString = function(){
		var ret = '(';
		for(var prop in this){
			if(this.hasOwnProperty(prop)){
				if(_.isFunction(this[prop])){
					//Do nothing
				}else if(_.isObject(this[prop])){
					ret += prop + ' is ' + JSON.stringify(this[prop]);
				}else if(_.isArray(this[prop])){
					ret += prop + ' is ' + this[prop].join(', ');
				}else{
					ret += prop + ' is ' + this[prop];
				}
			}
			/*ret += ' and '*/
		}
		ret += ')';
		return ret;
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	/**
	 * I have no idea but this seems like a cool way to build a selector for NPC's in a range
	 */

	app.ObjectTarget = function(options){
		_.extend(this, options);
		this._is_object_target = true;

		if(_.isString(this.type)){
			this.type = [this.type];
		}

		return this;
	}
	app.ObjectTarget.prototype.serialize = function(object) {

	}
	app.ObjectTarget.prototype.match = function(object){

		if(this.is_object && !object._is_object){
			return false;
		}


		if(this.type && !_.contains(this.type, object.type)){
			//Type
			return false;
		}
		if(this.gender && this.gender != object.gender){
			//Type
			return false
		}
		if(this.race && this.race != object.race){
			//Type
			return false
		}
		if(!_.isUndefined(this._has_stuff_in_invetory) && !_.isUndefined(object._has_stuff_in_invetory) && (this._has_stuff_in_invetory != object._has_stuff_in_invetory)){
			return false;
		}
		if(this.age){
			if(_.isObject(this.age)){
				//console.log(this.age.value, '>', object.age, this.age.value > object.age)
				if(this.age.compairison == '>'){
					if((this.age.value > object.age)){
						return false;
					}
				}else if(this.age.compairison == '<'){
					if((this.age.value < object.age)){
						return false;
					}
				}else{
					throw new Error("Invalid compairison:" + this.age.compairison);
				}
			}else if(this.age != object.age){
				//Type
				return false
			}
		}
		if(!_.isUndefined(this.is_dead) && this.is_dead != object.is_dead()){
			//Type
			return false
		}
		return true;
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
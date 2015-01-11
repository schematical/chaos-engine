var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	/**
	 * I have no idea but this seems like a cool way to build a selector for NPC's in a range
	 */

	app.NPCTarget = function(options){
		this.selector = null;
		_.extend(this, options);
		if(this.type && !_.isArray(this.type)){
			this.type = [this.type];
		}
		return this;
	}
	app.NPCTarget.prototype.match = function(npc){
		if(!npc._is_npc){
			return false;
		}


		if(this.type && !_.contains(this.type, npc.type)){
			//Type
			return false;
		}
		if(this.gender && this.gender != npc.gender){
			//Type
			return false
		}
		if(this.race && this.race != npc.race){
			//Type
			return false
		}
		if(!_.isUndefined(this.is_dead) && this.is_dead != npc.is_dead()){
			//Type
			return false
		}
		return true;
	}
}
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
		var valid_npc = false;
		if(this.selector == '*'){
			//Match all
			valid_npc = true;
		}
		if(this.type && _.contains(this.type, npc.type)){
			//Type
			valid_npc = true;
		}
		if(this.gender && this.gender == npc.gender){
			//Type
			valid_npc = true;
		}
		return valid_npc;
	}
}
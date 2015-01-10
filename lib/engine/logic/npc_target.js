var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	/**
	 * I have no idea but this seems like a cool way to build a selector for NPC's in a range
	 */

	app.NPCTarget = function(options){
		this.selector = null;
		_.extend(this, options);

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
		return valid_npc;
	}
}
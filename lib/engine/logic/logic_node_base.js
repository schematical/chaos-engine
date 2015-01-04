var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.LogicNodeBase = function(options){
		this.npc = null;
		this.name = null;


		_.extend(this, options);
		if(!this.npc){
			throw new Error("Invalid NPC passed in");
		}
		return this;
	}



	/*app.LogicNodeBase.prototype.nextNode = function(){

	}
	app.LogicNodeBase.prototype.prevNode = function(){

	}*/
}
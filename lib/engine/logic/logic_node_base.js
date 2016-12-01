"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.LogicNodeBase = function(options){
		this.npc = null;
		this.name = null;
		this.exicuting = false;

		_.extend(this, options);
		if(!this.npc){
			throw new Error("Invalid NPC passed in");
		}
		if(this.target && !this.target.match){
			this.target = new app.ObjectTarget(this.target);
		}
		return this;
	}
	app.LogicNodeBase.prototype.toString = function(){
		var ret = '';
		ret += this.verbage || this.type + ' ';
		if(this.target){
			ret += this.target.toString();
		}
		return ret;
	}


	/*app.LogicNodeBase.prototype.nextNode = function(){

	}
	app.LogicNodeBase.prototype.prevNode = function(){

	}*/
}
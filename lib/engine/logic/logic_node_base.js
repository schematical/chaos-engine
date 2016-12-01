"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.LogicNodeBase = class LogicNodeBase{
		constructor(options){
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
		}
		toString(){
			var ret = '';
			ret += this.verbage || this.type + ' ';
			if(this.target){
				ret += this.target.toString();
			}
			return ret;
		}
	}

	/*
	nextNode(){

	}
	prevNode(){

	}
	*/
}
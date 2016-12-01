"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.logic.inputs.HasInInventory = class HasInInventory  extends app.InputNodeBase{
		constructor(options) {

			var default_options = {
				type: 'HasInInventory',
				target: null//The Object to look for
			}
			_.extend(default_options, options);

			super(default_options);
			if (!this.target) {
				if (options._randomize) {
					this.target = app.LogicFactory.random_target({
						type: [app.LogicFactory.random_value('inventory-object.type')]
					});
				} else {
					throw new Error("Invalid Object Type Passed in");
				}
			}
		}
		condition(data, cb){

			for(var i in this.npc.inventory){

				if(this.target.match(this.npc.inventory[i])){
					//console.log("Found in inventory:" + this.npc.inventory[i].type);
					return this.trigger(
						{
							target:this.npc.inventory[i]
						},
						cb
					);
				}
			}
			return cb();

		}
	}
}
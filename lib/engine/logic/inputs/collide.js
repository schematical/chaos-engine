"use strict";

module.exports = function(app){
	//THIS CAN ONLY HAPPEN BETWEEN TWO NPCS
	app.logic.inputs.Collide = class Collide extends app.InputNodeBase {
		constructor(options) {
			options.type = 'Collide';
			super(options);
			//This is irrelevant

			this.npc.on('collision', function (event, data, cb) {
				if (this.target && !this.target.match(data.target)) {
					return cb();//The target does not match
				}
				this.trigger(data, cb)
			})
		}

		condition(data, cb) {
			return cb();
		}
	}

}
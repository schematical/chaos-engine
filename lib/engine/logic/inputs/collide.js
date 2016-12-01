"use strict";

module.exports = function(app){
	//THIS CAN ONLY HAPPEN BETWEEN TWO NPCS
	app.logic.inputs.Collide = class Collide extends app.InputNodeBase {
		constructor(options) {
			options.type = 'Collide';
			var logic_node_base = new app.InputNodeBase(options);
			//This is irrelevant

			this.npc.on('collision', function (event, data, cb) {
				if (logic_node_base.target && !logic_node_base.target.match(data.target)) {
					return cb();//The target does not match
				}
				logic_node_base.trigger(data, cb)
			})
		}

		condition(data, cb) {
			return cb();
		}
	}

}
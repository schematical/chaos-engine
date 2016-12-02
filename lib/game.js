"use strict";
const _ = require('underscore');
module.exports = function(app){
 	app.Game = class Game extends app.Engine {
		constructor(options){
			var default_options = {
				world: null,
				RAT_CT:10,
				FOOD_CT:2,
				ANT_CT:10,
				GOLD_CT:1
			}
			var options = _.extend(default_options, options);
			/*if(!options.world){
			 options.world = new app.World();
			 }*/

			super(options);

		}
	}
}
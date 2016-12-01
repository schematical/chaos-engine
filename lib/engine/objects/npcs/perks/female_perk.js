"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.perks.FemalePerk = class FemalePerk extends app.PerkBase{
		constructor(options) {
			var default_options = {
				perk_class: 'FemalePerk'
			}
			_.extend(default_options, options);
			super(default_options);
			this.npc.biology.reproduction_age = 20;//Number of terms before can reproduce
			this.npc.biology.gestation_period = 10;//Number of terms before spawn
			this.npc.biology.fertility = .8;//Chances of getting pregnent
			this.npc.biology.litter_ct = 4;//Number of offspring per litter
			this.npc.is_pregant = false;

			this.npc.on('interact', (event, data, cb)=>{
				//console.log("Female Interaction:" + data.interaction_type);
				if (data.interaction_type == 'mate') {

					if (data.npc.gender == 'f') {
						//No idea
						console.log("Lesbians?")
					} else if (data.npc.gender == 'm') {

						//console.log(perk_base.npc.id + ' mateing with ' + data.npc.id);
						//TODO: Add memory of mate

						if (data.npc.race != this.npc.race) {
							console.log("Inter Species Mating:", this.npc.id + ' mateing with ' + data.npc.id);
							return cb();
							//throw new Error("Inter species mating...");
						}
						if (this.npc.age <= this.npc.biology.reproduction_age) {
							// console.log('Failed: ' + data.npc.age + ' trying to mate with ' +  perk_base.npc.age);
							return cb();
						}
						if (this.npc.is_pregant) {
							//console.log(data.npc.id + ' already pregnant. Gestation Ct:' + perk_base.npc.gestation_ct);
							return cb();
						}
						data.npc.logHistory(' mated with ' + this.npc.id);
						this.npc.logHistory(' mated with ' + data.npc.id);
						var mate_successfull = Math.round(this.npc.biology.fertility * Math.random());
						if (mate_successfull) {
							data.npc.logHistory(' impregnated ' + this.npc.id);
							this.npc.logHistory(' was impregnated by ' + data.npc.id);

							this.npc.is_pregant = true;
							this.npc.gestation_ct = this.npc.biology.gestation_period;
							this.npc.litter_father = data.npc;


						}

					} else {
						throw new Error("What gender is:" + data.npc.gender)
					}
				}
				return cb();
			});
			this.npc.on('cycle_physics', (event, data, cb)=> {
				if (!this.npc.is_dead()) {
					if (this.npc.is_pregant) {

						this.npc.gestation_ct -= 1;

						if (this.npc.gestation_ct == 0) {
							this.npc.gestation_ct = -1;
							this.npc.is_pregant = false;
							//Yay children!!!
							var child_ct = Math.ceil(Math.random() * perk_base.npc.biology.litter_ct);
							return async.doWhilst(
								function (cb) {
									return this.npc.clone(function (err, cloned_npc) {

										//Mix and match the brain and tra
										app.LogicFactory.add_random_node_chain({
											npc: cloned_npc
										});

										//Basic stuff
										cloned_npc.setXY(this.npc.x, this.npc.y);

										cloned_npc.nourishment = cloned_npc.biology.nourishment_capacity * .75;
										cloned_npc.age = 0;
										cloned_npc.children_ct = 0;
										//cloned_npc.generation = //this is actually done in the clone phase
										cloned_npc.markUpdated();
										cloned_npc.logHistory('was given birth by ' + this.npc.id);
										this.npc.logHistory('gave birth to ' + cloned_npc.id);


										child_ct -= 1;
										//Iterate up the total child count
										this.npc.children_ct += 1;

										return cb();
									});
								},
								function () {

									return child_ct < 0;
								},
								function () {
									//Done

									return cb();
								}
							)
						}
					}
				}
				return cb();

			});
		}
	}
}
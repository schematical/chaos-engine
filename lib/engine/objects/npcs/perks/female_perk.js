var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.perks.FemalePerk = function(options){
		var default_options = {
			perk_class:'FemalePerk'
		}
		_.extend(default_options, options);
		var perk_base = new app.PerkBase(default_options);
		perk_base.npc.biology.reproduction_age = 20;//Number of terms before can reproduce
		perk_base.npc.biology.gestation_period = 10;//Number of terms before spawn
		perk_base.npc.biology.fertility = .8;//Chances of getting pregnent
		perk_base.npc.biology.litter_ct = 4;//Number of offspring per litter
		perk_base.npc.is_pregant = false;

		perk_base.npc.on('interact', function(event, data, cb){
			//console.log("Female Interaction:" + data.interaction_type);
			if(data.interaction_type == 'mate'){

				if(data.npc.gender == 'f'){
					//No idea
					console.log("Lesbians?")
				}else if(data.npc.gender == 'm'){

					//console.log(perk_base.npc.id + ' mateing with ' + data.npc.id);
					//TODO: Add memory of mate

					if(data.npc.race != perk_base.npc.race){
						console.log("Inter Species Mating:", perk_base.npc.id + ' mateing with ' + data.npc.id);
						return cb();
						//throw new Error("Inter species mating...");
					}
					if(perk_base.npc.age <= perk_base.npc.biology.reproduction_age){
						// console.log('Failed: ' + data.npc.age + ' trying to mate with ' +  perk_base.npc.age);
						return cb();
					}
					if(perk_base.npc.is_pregant){
						//console.log(data.npc.id + ' already pregnant. Gestation Ct:' + perk_base.npc.gestation_ct);
						return cb();
					}
					data.npc.logHistory(' mated with ' + perk_base.npc.id);
					perk_base.npc.logHistory(' mated with ' + data.npc.id);
					var mate_successfull = Math.round(perk_base.npc.biology.fertility * Math.random());
					if(mate_successfull){
						data.npc.logHistory(' impregnated ' + perk_base.npc.id);
						perk_base.npc.logHistory(' was impregnated by ' + data.npc.id);

						perk_base.npc.is_pregant = true;
						perk_base.npc.gestation_ct = perk_base.npc.biology.gestation_period;
						perk_base.npc.litter_father = data.npc;


					}

				}else{
					throw new Error("What gender is:" + data.npc.gender)
				}
			}
			return cb();
		});
		perk_base.npc.on('cycle_physics', function(event, data, cb){
			if(!this.is_dead()){
				if(perk_base.npc.is_pregant ){

					perk_base.npc.gestation_ct -= 1;

					if(perk_base.npc.gestation_ct == 0){
						perk_base.npc.gestation_ct = -1;
						perk_base.npc.is_pregant = false;
						//Yay children!!!
						var child_ct = Math.ceil(Math.random() * perk_base.npc.biology.litter_ct);
						async.doWhilst(
						function(cb){
							return perk_base.npc.clone(function(err, cloned_npc){

								//Mix and match the brain and tra
								app.LogicFactory.add_random_node_chain({
									npc:cloned_npc
								});

								//Basic stuff
								cloned_npc.setXY(perk_base.npc.x, perk_base.npc.y);

								cloned_npc.nourishment = cloned_npc.biology.nourishment_capacity  *.75;
								cloned_npc.age = 0;
								cloned_npc.generation = cloned_npc.generation + 1;
								cloned_npc.markUpdated();
								cloned_npc.logHistory('was given birth by ' + perk_base.npc.id);
								perk_base.npc.logHistory('gave birth to ' + cloned_npc.id);


								child_ct -= 1;
								//Iterate up the total child count
								perk_base.npc.children_ct += 1;

								return cb();
							});
						},
						function(){

							return child_ct < 0;
						},
						function(){
							//Done

							return cb();
						})
					}
				}
			}
			return cb();

		});

		return perk_base;
	}
}
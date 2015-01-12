var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.perks.FemalePerk = function(options){
		var default_options = {}
		_.extend(default_options, options);
		var perk_base = new app.PerkBase(default_options);
		perk_base.npc.biology.gestation_period = 1;//Number of terms before spawn
		perk_base.npc.biology.fertility = .8;//Chances of getting pregnent
		perk_base.npc.biology.litter_ct = 4;//Number of offspring per litter
		perk_base.npc.is_pregant = false;

		perk_base.npc.on('interact', function(event, data, cb){
			console.log("Female Interaction:");
			if(data.interaction_type == 'mate'){
				if(data.npc.gender == 'f'){
					//No idea
					console.log("Lesbians?")
				}else if(data.npc.gender == 'm'){

					console.log(perk_base.npc.id + ' mateing with ' + data.npc.id);
					//TODO: Add memory of mate

					if(data.npc.race != perk_base.npc.race){
						throw new Error("Inter species mating...");
					}
					var mate_successfull = Math.round(perk_base.npc.biology.fertility * Math.random());
					if(mate_successfull){
						perk_base.npc.is_pregant = true;
						perk_base.npc.gestaton_ct = perk_base.npc.biology.gestation_period;
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
					console.log(perk_base.npc.id + ' is pregnant');
					perk_base.npc.gestaton_ct -= 1;
				}
				if(perk_base.npc.gestaton_ct == 0){
					perk_base.npc.is_pregant = false;
					//Yay children!!!
					var child_ct = Math.ceil(Math.random() * perk_base.npc.biology.litter_ct);
					async.doWhilst(
					function(cb){
						return perk_base.npc.clone(function(err, cloned_npc){
							//Mix and match the brain and tra
							cloned_npc.setXY(perk_base.npc.x, perk_base.npc.y);
							child_ct -= 1;
							return cb();
						});
					},
					function(){
						console.log(child_ct);
						return child_ct < 0;
					},
					function(){
						//Done
						return cb();
					})
				}
			}
			return cb();

		});

		return perk_base;
	}
}
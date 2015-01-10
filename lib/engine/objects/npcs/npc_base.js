var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.NPCBase = function(options){
		var default_options = {

			age:1,
			size:50,
			energy:1000,
			health:100,
			nourishment:100,
			hydration:100,
			energy_consumption:1,
			carrying_capacity:1,
			_actingOutputNode:null,
			brain:{
				pleasure:0,
				memory:{},
				decision_matrix:{},
				biology:{
					memory_length:0,
					max_health:100,
					pleasure_matrix:{

					}
				}
			},
			facing:'down',
			inventory:{},


			_is_blocking:true,
			_is_npc:true//NO Shit

		}
		_.extend(default_options, options);

		var npc_base = new app.PhysicalObjectBase(default_options);
		//Register it globally as an NPC
		npc_base.world.add_npc(npc_base);
		npc_base.walk = {
			exec:function(x, y){

				if(x == npc_base.x && y == npc_base){
					//No change so no trigger
					return false;
				}

				//Check to see if NPC has energy
				var energy_cost = 1;


				if(npc_base.energy < energy_cost){
					console.log(npc_base.id + " energy is at " + npc_base.energy);
					return false;
				}

				//Collision Detection
				var destination_tile = npc_base.world.getTile(x, y);
				if(!destination_tile){
					//Your at the end of the level
					return false;
				}
				for(var object_id in destination_tile.objects){
					if(destination_tile.objects[object_id].is_blocking()){
						var event = {
							target:npc_base,
							tile:destination_tile
						}
						console.log(npc_base.id + ' collided with ' + object_id);
						destination_tile.objects[object_id].trigger('collision', event)
						return false;
					}
				}

				npc_base.energy -= energy_cost;
				npc_base.setXY(x, y);


			},
			left:function(){
				npc_base.facing = 'left';
				npc_base.walk.exec(npc_base.x - 1, npc_base.y)

			},
			right:function(){
				npc_base.facing = 'right';
				npc_base.walk.exec(npc_base.x + 1, npc_base.y)
			},
			up:function(){
				npc_base.facing = 'up';
				npc_base.walk.exec(npc_base.x, npc_base.y  - 1);
			},
			down:function(){
				npc_base.facing = 'down';
				npc_base.walk.exec(npc_base.x, npc_base.y  + 1);

			}
		}
		npc_base.interact = function(data){
			var target_x = npc_base.x;

			var target_y = npc_base.y;
			if(npc_base.facing == 'down'){
				target_y += 1;
			}else if(npc_base.facing == 'up'){
				target_y -= 1;
			}else if(npc_base.facing == 'right'){
				target_x += 1;
			}else if(npc_base.facing == 'left'){
				target_x -= 1;
			}
			var target_tile = npc_base.world.getTile(target_x, target_y);
			if(!target_tile){
				return;
			}
			var event = {
				npc: npc_base
			}
			target_tile.trigger('interact', event);
		}
		npc_base.cycle_log = function(){}//Just to help logging
		npc_base.cycle = function(_cb){
			//Eventually run through setup logic
			var acting_npc = this;

			acting_npc._actingOutputNode = null;//TODO: Set some type of timeout
			return async.eachSeries(
			    Object.keys(acting_npc.brain.decision_matrix),
				function(key, cb){
					if(acting_npc._actingOutputNode){
						npc_base.cycle_log();
						return _cb();
					}
					return acting_npc.brain.decision_matrix[key].process({}, cb)
			    },
			    function(errs){
					npc_base.cycle_log();
					return _cb();
			    }
			)
			/*return cb();*/
		}
		npc_base.addLogicNode = function(inputNode, namespace){
			if(!namespace){
				namespace = this.id + '-logic-node-' + Object.keys(this.brain.decision_matrix).length;
			}
			this.brain.decision_matrix[namespace] = inputNode;
		}
		npc_base.ingest = function(data){
			if(!npc_base.inventory[data.object.id]){
				console.error("Player attemptng to ingest something not in their inventory");
			}
			npc.remove_from_inventory(data.object.id);
			npc_base.inventory[data.object.id].ingest(npc_base, data, function(){
				//Nothing to do
				//Perhps reflect?
			});
		}
		npc_base.add_to_inventory = function(object){
			npc_base.inventory[object.id] = object;
			npc_base.markUpdated();
		}
		npc_base.remove_from_inventory = function(object_id){
			if(object_id.id){
				object_id = object_id.id;
			}
			if(!npc_base.inventory[object_id]){
				throw new Error("NPC " + npc_base.id + ' does not have inventory_object ' + object_id + ' to remove');
			}
			delete(npc_base.inventory[object_id]);
			npc_base.markUpdated();

		}
		npc_base.on('cycle_physics', function(event, data, next){
			//Age
			this.age += 1;
			//
			this.energy -= 1;

			this.nourishment -= 1;

			this.hydration -= 1;

			if(this.nourishment <= 0){
				this.nourishment = 0;
				this.health -= 1;
			}
			if(this.health <= 0){
				this.health = 0;
				//TODO: Perhaps pass in cause of death or something
				return this.trigger('death', {}, next);
			}
			return next();
		});
		npc_base.on('death', function(event, data, next){
			this.state = 'dead';
			//Remove from NPC list as we don't need to process its brian thoughts
			this.world.remove_npc(this);
			return next();
		});
		npc_base.is_dead = function(){
			return this.state == 'dead';//TODO: Or possibly desposed of
		}
		/**
		 * This is where an NPC watches for the pleasure delta(change) and stores it in memory with the inputNode
		 * @param next
		 */
		npc_base.reflect = function(next){

		}
		var _toObject = _.bind(npc_base.toObject, npc_base);
		npc_base.toObject = function(){
			var ret = _toObject();
			ret.inventory = {};
			for(var i in this.inventory){
				ret.inventory[i] = this.inventory[i].toObject();
			}
			return ret;
		}
		return npc_base;
	}

}
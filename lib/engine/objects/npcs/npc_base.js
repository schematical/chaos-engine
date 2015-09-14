var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.LogicFactory.regester_value('npc.stat', 'age');
	app.LogicFactory.regester_value('npc.stat', 'energy');
	app.LogicFactory.regester_value('npc.stat', 'hydration');
	app.LogicFactory.regester_value('npc.stat', 'nourishment');
	app.LogicFactory.regester_value('npc.stat', 'pleasure');
	var genders = ['m', 'f'];
	app.NPCBase = function(options){
		var default_options = {
			generation:0,
			children_ct:0,
			gender:null,
			name:null,
			age:1,
			size:50,
			energy:1000,
			history:[],//TODO: Just putting this here for now
			health:100,
			nourishment:100,
			hydration:100,
			energy_consumption:1,
			carrying_capacity:1,
			_actingOutputNode:null,
			race:null,
			pleasure:0,
			brain:{

				memory:{},
				decision_matrix:{},

				pleasure_matrix:{

				}

			},
			biology:{
				memory_length:0,
				max_health:100,
				nourishment_capacity:100,
				life_peak:1000//The point in their life when their stats are the highest

			},
			equipped_slots:{

			},
			facing:'down',
			inventory:{},



			_is_blocking:true,
			_is_npc:true//NO Shit

		}
		_.extend(default_options, options);

		var npc_base = new app.PhysicalObjectBase(default_options);
		if(!npc_base.race){
			throw new Error("Need to set a race");
		}
		if(!npc_base.gender){
			npc_base.gender = genders[Math.floor(Math.random() * 2)];
		}
		if(!npc_base.name){
			npc_base.name = npc_base.id;
		}
		//Register it globally as an NPC
		npc_base.world.add_npc(npc_base);
		//Apply NPC perks
		if(npc_base.gender == 'f'){
			var perk = new app.perks.FemalePerk({
				npc:npc_base
			});
		}else{
			var perk = new app.perks.MalePerk({
				npc:npc_base
			});
		}
		npc_base.walk = {
			exec:function(x, y){

				if(x == npc_base.x && y == npc_base){
					//No change so no trigger
					return false;
				}

				//Check to see if NPC has energy
				var energy_cost = 1;


				if(npc_base.energy < energy_cost){
					//console.log(npc_base.id + " energy is at " + npc_base.energy);
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
						//console.log(npc_base.id + ' collided with ' + object_id);
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
		npc_base.logHistory = function(desc){
			this.history.push({
				date:new Date(),
				desc:desc
			})

		}
		npc_base.attack = function(data, cb){
			//Check for equipped weapons
			if(this.equipped_slots.head){
				return this.equipped_slots.head.use_attack(
					npc_base,
					data,
					cb
				)
			}
			return cb();
		}
		npc_base.recive_attack = function(attacking_npc, data, cb){
			if(!data.damage){
				throw new Error("Attack has no damage?");
			}
			//TODO: Store in memory attacking NPC

			//TODO: Adjust damage based on armor etc
			this.health -= data.damage;
			//console.log(attacking_npc.id + ' attacked ' + this.id + ' for ' + data.damage + ' damage. Health:' + this.health);
			//TODO: Tell pleasure matrix to adjust accordingly

			attacking_npc.logHistory('attacked ' + this.id + ' for ' + data.damage + ' damage');
			this.logHistory('was attacked by ' + attacking_npc.id + ' for ' + data.damage + ' damage');
			npc_base.markUpdated();
			return cb();
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
					return acting_npc.brain.decision_matrix[key].process({}, function(err){
						if(err){
							if(acting_npc.brain.decision_matrix[key]._randomize){
								//Then it was generated so just remove and replace it
								delete(acting_npc.brain.decision_matrix[key]);
								app.LogicFactory.add_random_node_chain({
									npc:npc_base
								});
							}else{
								throw err;
							}
						}
						return cb();
					})
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
			this.remove_from_inventory(data.object.id);
			this.logHistory('ingested' + data.object.id);


			npc_base.inventory[data.object.id].ingest(npc_base, data, function(){
				data.object.destroy();
				//Nothing to do
				//Perhps reflect?

			});
		}
		npc_base.add_to_inventory = function(object){
			npc_base.inventory[object.id] = object;
			npc_base._has_stuff_in_invetory = true;
			object.container = this;
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
			if(Object.keys(npc_base.inventory).length == 0){
				npc_base._has_stuff_in_invetory = false;
			}else{
				npc_base._has_stuff_in_invetory = true;
			}
			npc_base.markUpdated();

		}
		npc_base.on('cycle_physics', function(event, data, next){

			if(!this.is_dead()){


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
				/*if(this.hydration <= 0){
					this.hydration = 0;
					this.health -= 1;
				}*/
				if(this.health <= 0){
					this.health = 0;
					//TODO: Perhaps pass in cause of death or something

					return this.trigger('death', {}, next);
				}

				//slowly reset mood
				if(this.pleasure != 0){
					if(this.pleasure > -1 && this.pleasure < 1){
						this.pleasure = 0;
					}else if(this.pleasure > 0){
						this.pleasure -= 1;
					}else{
						this.pleasure += 1;
					}
				}

			}else{
				//Begin to rot and attact preditors?

			}
			return next();
		});
		npc_base.on('death', function(event, data, next){
			this.logHistory('died');
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


		npc_base.serializeBrain = function(){
			var brain = {}
			brain.pleasure = this.brain.pleasure;
			brain.memory = this.brain.memory;//Got to work on this


			//TODO: Get this figured out
			brain.decision_matrix = {}
			for(var i in this.brain.decision_matrix){
				brain.decision_matrix[i] = this.brain.decision_matrix[i].serialize();
			}
			brain.pleasure_matrix = this.brain.pleasure_matrix;

			brain.biology = this.brain.biology;
			brain.equipped_slots = this.brain.equipped_slots;
			return brain;
		}

		var _toObject = _.bind(npc_base.toObject, npc_base);
		npc_base.toObject = function(options){
			options = options || {};
			var ret = _toObject(options);

			ret.generation = this.generation;
			ret.children_ct = this.children_ct;
			ret.health = this.health;
			ret.nourishment = this.nourishment;
			ret.hydration = this.hydration;
			ret.is_pregant = this.is_pregant;

			ret.gestation_ct = this.gestation_ct;
			ret.litter_father = (this.litter_father && this.litter_father.id) || this.litter_father;//Need to get actual NPC
			ret.history = this.history;
			ret.inventory = {};
			for(var i in this.inventory){
				ret.inventory[i] = this.inventory[i].toObject();
			}

			//TODO: REmove Hack
			options.include_brain = true;


			if(options.include_brain){
				ret.brain = this.serializeBrain();

			}
			return ret;
		}
		npc_base.on('serialize',function(event, data, cb){
			data._is_npc = true;
			data.generation = this.generation;
			data.children_ct = this.children_ct;
			data.npc_class = this.npc_class;
			data.gender = this.gender;
			data.name = this.name;
			data.age = this.age;
			data.size = this.size;
			data.energy = this.energy;
			data.health = this.health;
			data.nourishment = this.nourishment;

			data.hydration = this.hydration;
			data.energy_consumption = this.energy_consumption;
			data.carrying_capacity = this.carrying_capacity;
			data.race = this.race;
			data.facing = this.facing;
			data.is_pregant = this.is_pregant;
			data.gestation_ct = this.gestation_ct;
			data.litter_father = (this.litter_father && this.litter_father.id) || this.litter_father;//Need to get actual NPC
			data.history = this.history;
			data.brain = this.serializeBrain();
			if(!data.inventory){
				return cb();
			}
			return async.eachSeries(
			    Object.keys(data.inventory),
			    function(object_id, cb){
					var inventory_object = data.inventory[object_id];
					var object_data = {};
					//ThiS ALL IS ALREADY IN THE OBJECT MATRIX. ALL WE NEED IS THE ID.

					data.inventory[object_data.id] = object_data.id;
					return cb();
					/*return inventory_object.trigger('serialize', object_data, function(){
						data.inventory[object_data.id] = object_data;
						return cb();
					});*/
			    },
			    function(errs){
					return cb();
			    }
			);

		});
		npc_base.on('deserialize',function(event, data, cb){
			console.log("Deserializing:" + data.id);
			this.npc_class = data.npc_class;
			this.generation = data.generation;
			this.children_ct = data.children_ct;
			this.gender = data.gender;
			this.name = data.name;
			this.age = data.age;
			this.size = data.size;
			this.energy = data.energy;
			this.health = data.health;
			this.nourishment = data.nourishment;

			this.hydration = data.hydration;
			this.energy_consumption = data.energy_consumption;
			this.carrying_capacity = data.carrying_capacity;
			this.race = data.race;

			this.brain = {}
			this.brain.pleasure = data.brain.pleasure;
			this.brain.memory = data.brain.memory;//Got to work on this
			this.facing = data.facing;

			this.is_pregant = data.is_pregant;
			this.gestation_ct = data.gestation_ct;
			this.history = data.history;

			this.litter_father = (data.litter_father && data.litter_father.id) || data.litter_father;//Need to get actual NPC

			this.brain.pleasure_matrix = data.brain.pleasure_matrix;

			this.brain.biology = data.brain.biology;
			this.brain.equipped_slots = data.brain.equipped_slots;
			var _this = this;

			async.series([
			    function(cb){
					if(!data.inventory){
						return cb();
					}

					return async.eachSeries(
						Object.keys(data.inventory),
						function(object_id, cb){
							var object =  _this.world.getObjectById(object_id);
							if(object){
								_this.inventory[object_id] = object;
							}else{
								throw new Error("Cannot find Inventory Object in " + _this.id + "'s inventory. Object Id:" + object_id);
								//TODO: Load object into world?
							}

							return cb();

						},
						function(errs){
							return cb();
						}
					);
				},
				function(cb){

					_this.brain.decision_matrix = {}
					async.eachSeries(
						Object.keys(data.brain.decision_matrix),
						function(node_id, cb){
							app.Serializer.deserialize_logicNodeChain(_this, data.brain.decision_matrix[node_id], function(err, logic_node){
								if(err) throw err;
								_this.brain.decision_matrix[node_id] = logic_node;
								return cb();
							});

						},
						cb
					)
				},
			],
			cb);



		});
		npc_base.clone = function(cb){
			//Serialize
			var npc_data = {};
			npc_base.trigger('serialize', npc_data, function(){
				npc_data.generation = 	npc_base.generation += 1,
				npc_data.name = npc_data.id = npc_base.type +'-clone-' + npc_data.generation + '-' + Object.keys(npc_base.world.objects).length,
				app.Serializer.deserialize_npc(npc_base.world, npc_data, cb);

			});
		}
		return npc_base;
	}

}
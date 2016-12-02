"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.LogicFactory.regester_value('npc.stat', 'age');
	app.LogicFactory.regester_value('npc.stat', 'energy');
	app.LogicFactory.regester_value('npc.stat', 'hydration');
	app.LogicFactory.regester_value('npc.stat', 'nourishment');
	app.LogicFactory.regester_value('npc.stat', 'pleasure');
	var genders = ['m', 'f'];
	app.NPCBase = class NPCBase extends app.PhysicalObjectBase{
		constructor(options) {
			var default_options = {
				generation: 0,
				children_ct: 0,
				gender: null,
				name: null,
				age: 1,
				size: 50,
				energy: 1000,
				history: [],//TODO: Just putting this here for now
				health: 100,
				nourishment: 100,
				hydration: 100,
				energy_consumption: 1,
				carrying_capacity: 1,
				_actingOutputNode: null,
				race: null,
				pleasure: 0,
				brain: {

					memory: {},
					decision_matrix: {},

					pleasure_matrix: {}

				},
				biology: {
					memory_length: 0,
					max_health: 100,
					nourishment_capacity: 100,
					life_peak: 1000//The point in their life when their stats are the highest

				},
				equipped_slots: {},
				facing: 'down',
				inventory: {},


				_is_blocking: true,
				_is_npc: true//NO Shit

			}
			_.extend(default_options, options);

			super(default_options);
			if (!this.race) {
				throw new Error("Need to set a race");
			}
			if (!this.gender) {
				this.gender = genders[Math.floor(Math.random() * 2)];
			}
			if (!this.name) {
				this.name = this.id;
			}
			//Register it globally as an NPC
			this.world.add_npc(this);
			//Apply NPC perks
			if (this.gender == 'f') {
				var perk = new app.perks.FemalePerk({
					npc: this
				});
			} else {
				var perk = new app.perks.MalePerk({
					npc: this
				});
			}


			this.on('cycle_physics', (event, data, next) =>{

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
						this.logHistory('starving to death. Health dropped to ' + this.health);
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
			this.on('death', function(event, data, next){
				this.logHistory('died');
				this.state = 'dead';
				this._is_blocking = false;//Need to do something about this
				//Remove from NPC list as we don't need to process its brian thoughts
				//this.world.remove_npc(this);
				return next();
			});


			this.on('serialize',function(event, data, cb){
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
				if(!this.inventory){
					return cb();
				}
				data.inventory = {};
				return async.eachSeries(
					Object.keys(this.inventory),
					(object_id, cb)=>{
						var inventory_object = this.inventory[object_id];

						//ThiS ALL IS ALREADY IN THE OBJECT MATRIX. ALL WE NEED IS THE ID.

						data.inventory[inventory_object.id] = inventory_object.id;
						return cb();
						/*return inventory_object.trigger('serialize', object_data, function(){
						 data.inventory[object_data.id] = object_data;
						 return cb();
						 });*/
					},
					(errs)=>{
						return cb();
					}
				);

			});
			this.on('deserialize',(event, data, cb)=>{

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
						(cb) =>{
							if(!data.inventory){
								return cb();
							}

							return async.eachSeries(
								Object.keys(data.inventory),
								(object_id, cb)=>{
									var object =  _this.world.getObjectById(object_id);
									if(object){
										_this.add_to_inventory(object)
									}else{
										/*throw new Error*/console.error("Cannot find Inventory Object in " + _this.id + "'s inventory. Object Id:" + object_id);
										//TODO: Load object into world?
									}

									return cb();

								},
								function(errs){
									return cb();
								}
							);
						},
						(cb) =>{

							_this.brain.decision_matrix = {}
							async.eachSeries(
								Object.keys(data.brain.decision_matrix),
								(node_id, cb) =>{
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
		}
		get walk() {
			var npc_base = this;
			return {
				exec: (x, y)=> {

					if (x == npc_base.x && y == npc_base) {
						//No change so no trigger
						return false;
					}

					//Check to see if NPC has energy
					var energy_cost = 1;


					if (npc_base.energy < energy_cost) {
						//console.log(npc_base.id + " energy is at " + npc_base.energy);
						return false;
					}

					//Collision Detection
					var destination_tile = npc_base.world.getTile(x, y);
					if (!destination_tile) {
						//Your at the end of the level
						return false;
					}
					for (var object_id in destination_tile.objects) {
						if (destination_tile.objects[object_id].is_blocking()) {
							var event = {
								target: npc_base,
								tile: destination_tile
							}
							//console.log(npc_base.id + ' collided with ' + object_id);
							destination_tile.objects[object_id].trigger('collision', event)
							return false;
						}
					}

					npc_base.energy -= energy_cost;
					npc_base.setXY(x, y);
					return true;


				},
				left: ()=> {
					npc_base.facing = 'left';
					npc_base.walk.exec(npc_base.x - 1, npc_base.y)

				},
				right: ()=> {
					npc_base.facing = 'right';
					npc_base.walk.exec(npc_base.x + 1, npc_base.y)
				},
				up: ()=> {
					npc_base.facing = 'up';
					npc_base.walk.exec(npc_base.x, npc_base.y - 1);
				},
				down: ()=> {
					npc_base.facing = 'down';
					npc_base.walk.exec(npc_base.x, npc_base.y + 1);

				}
			}
		}
		logHistory(desc){
			this.history.push({
				date:new Date(),
				desc:desc
			})
			//TODO: Save to Redis

		}
		attack(data, cb){
			//Check for equipped weapons
			if(this.equipped_slots.head){
				return this.equipped_slots.head.use_attack(
					this,
					data,
					cb
				)
			}
			return cb();
		}
		recive_attack(attacking_npc, data, cb){
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
			this.markUpdated();
			return cb();
		}
		interact(data){
			var target_x = this.x;

			var target_y = this.y;
			if(this.facing == 'down'){
				target_y += 1;
			}else if(this.facing == 'up'){
				target_y -= 1;
			}else if(this.facing == 'right'){
				target_x += 1;
			}else if(this.facing == 'left'){
				target_x -= 1;
			}

			var target_tile = this.world.getTile(target_x, target_y);
			if(!target_tile){
				return;
			}
			var event = {
				npc: this
			}
			target_tile.trigger('interact', event);
		}
		cycle_log(){

		}//Just to help logging
		cycle(_cb){
			//Eventually run through setup logic
			switch(this.state){
				case('dead'):
					return _cb();
				break;
			}
			var acting_npc = this;

			acting_npc._actingOutputNode = null;//TODO: Set some type of timeout
			return async.eachSeries(
				Object.keys(acting_npc.brain.decision_matrix),
				(key, cb)=>{
					if(acting_npc._actingOutputNode){
						this.cycle_log();
						return _cb();
					}
					return acting_npc.brain.decision_matrix[key].process({}, (err, triggered)=>{
						if(err){
							if(acting_npc.brain.decision_matrix[key]._randomize){
								//Then it was generated so just remove and replace it
								delete(acting_npc.brain.decision_matrix[key]);
								app.LogicFactory.add_random_node_chain({
									npc:this
								});
							}else{
								throw err;
							}
						}
						if(triggered){
							this.cycle_log();
							return _cb()
						}
						return cb();
					})
				},
				(errs) =>{
					this.cycle_log();
					return _cb();
				}
			)
			/*return cb();*/
		}
		addLogicNode(inputNode, namespace){
			if(!namespace){
				namespace = this.id + '-logic-node-' + Object.keys(this.brain.decision_matrix).length;
			}
			this.brain.decision_matrix[namespace] = inputNode;
		}
		ingest(data, next){
			if(!this.inventory[data.object.id]){
				console.error("NPC attemptng to ingest something not in their inventory");
				return next(null, false);
			}

			this.logHistory('ingested ' + data.object.id + ' nourishment set to ' + this.nourishment);

			if( this.inventory[data.object.id].container.id != this.id){
				return next(new Error("Invalid containerID missmatch. InventoryObject(" + data.object.id + ") does not match containers: " + this.id + ' / ' + this.inventory[data.object.id].container.id))
			}
			return this.inventory[data.object.id].ingest(this, data, (err)=>{
				if(err) return next(err);
				//Nothing to do
				//Perhps reflect?
				return next();
			});
		}
		add_to_inventory(object){
			if(object.container && object.container.id != this.id){
				throw new Error("Error adding Object(" + object.id + ") to NPC(" + this.id + ")'s inventory. NPC(" + object.container.id + ") already has it" );
			}
			object.container = this;
			this.inventory[object.id] = object;
			this._has_stuff_in_invetory = true;
			this.markUpdated();
		}
		remove_from_inventory(object){

			object.container = null;

			if(!this.inventory[object.id]){
				throw new Error("NPC " + this.id + ' does not have inventory_object ' + object.id + ' to remove');
			}
			delete(this.inventory[object.id]);
			if(Object.keys(this.inventory).length == 0){
				this._has_stuff_in_invetory = false;
			}else{
				this._has_stuff_in_invetory = true;
			}
			this.markUpdated();

		}

		is_dead (){
			return this.state == 'dead';//TODO: Or possibly desposed of
		}
		/**
		 * This is where an NPC watches for the pleasure delta(change) and stores it in memory with the inputNode
		 * @param next
		 */
		reflect(next){
			throw new Error("Method `NpcBase.reflect` not written yet")
		}


		serializeBrain(){
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

		toObject(options){
			options = options || {};
			var ret = super.toObject(options);

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

		clone(cb){
			//Serialize
			var npc_data = {};
			this.trigger('serialize', npc_data, ()=>{
				npc_data.generation += 1;
				npc_data.name = npc_data.id = this.type +'-clone-' + npc_data.generation + '-' + Object.keys(this.world.objects).length,
				npc_data.history = [];
				npc_data.inventory = {};
				app.Serializer.deserialize_npc(this.world, npc_data, cb);

			});
		}

	}

}
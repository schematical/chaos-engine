var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	 app.WorldBase = function(options){
		 this.id = 'default';
		 this.name = this.id;
		 this.tiles = [];
		 this.objects = {};
		 this.npcs = {};

		 _.extend(this, options);
		 return this;
	 }
	app.WorldBase.prototype.cycle = function(cb){
		//Iterate through the whole world
		return async.series([
			_.bind(this.cycle_npcs,this),
			_.bind(this.cycle_physics, this),
			_.bind(this.save, this)
		],
		function(){
		    return cb();
		});


	}
	app.WorldBase.prototype.cycle_npcs = function(cb){
		//Iterate through all NPCs
		async.eachSeries(
		    Object.keys(this.npcs),
			_.bind(function(npc_id, cb){
				var npc = this.npcs[npc_id];
				process.nextTick(function(){
					return npc.cycle(cb);
				});
		    }, this),
		    function(errs){
				return cb();
		    }
		);
	}
	app.WorldBase.prototype.cycle_physics = function(cb){
		//Iterate through the whole world
		async.eachSeries(
			Object.keys(this.objects),
			_.bind(function(object_id, cb){

				var object = this.objects[object_id];
				process.nextTick(function(){
					return object.trigger('cycle_physics', {}, cb);
				});
			}, this),
			function(errs){
				return cb();
			}
		);
	}
	app.WorldBase.prototype.add_npc = function(npc){
		if(!npc /*|| !(npc instanceof app.NPCBase)*/){
			throw new Error("Invalid NPC passed in");
		}
		this.npcs[npc.id] = npc;
	}
	app.WorldBase.prototype.remove_npc = function(npc){
		if(!npc  || !npc._is_npc){
			throw new Error("Invalid NPC passed in");
		}
		if(!this.npcs[npc.id]){
			throw new Error("Missing NPC on death");
		}
		delete(this.npcs[npc.id]);
	}

	app.WorldBase.prototype.get_updates = function(){
		//Iterate through objects and get objects marked updated
		var update_data = {};
		update_data.objects = {};

		for(var object_id in this.objects){
			if(this.objects[object_id].isUpdated()){

				update_data.objects[object_id] = this.objects[object_id].toObject();

			}
		}
		return update_data;

	}
	app.WorldBase.prototype.getTile = function(x, y){
		if(this.tiles[x] && this.tiles[x][y]){
			return  this.tiles[x][y];
		}
		return null;

	}
	app.WorldBase.prototype.addObject = function(object, x, y){
		if(!object.id){
			throw new Error("Invalid object, need to have an id");
		}

		this.objects[object.id] = object;
		if(x && y){
			this.objects[object.id].setXY(x, y);
		}
	}
	app.WorldBase.prototype.getObjectById = function(object_id){
		return (this.objects[object_id] || null);
	}
	app.WorldBase.prototype.view_tiles = function(x, y, range){
		if(!range){
			range = 5
		}
		var response = {};
		for(var xi  = x - range; xi < x + range; xi++){
			for(var yi  = y - range; yi < y + range; yi++){
				if(this.tiles[xi] = this.tiles[xi][yi]){
					if(!response[xi]){
						response[xi] = {};
					}
					response[xi][yi] = this.tiles[xi][yi];
				}
			}
		}
		return response;
	}
	app.WorldBase.prototype.spawnRandom = function(spawn_func, count, tile_validatior_func){
		var objects = []
		for(var i = 0; i < count; i++){

			var object = spawn_func(i);
			var tile = null;
			var valid_tile = false;
			var tile_x = null;
			var tile_y = null;
			var escape_ct = 0;
			while(!valid_tile || (escape_ct > 10)){
			 	tile_x = Math.floor(Math.random() * this.width);
				tile_y = Math.floor(Math.random() * this.height);
				tile = this.getTile(tile_x, tile_y);
				if(tile_validatior_func){
					valid_tile = tile_validatior_func(tile);
				}else{
					valid_tile = true;
				}
				escape_ct += 1;
				if(escape_ct > 10){
					throw new Error("Could not find valid tile");
					return null;//Eventually
				}
			}

			object.setXY(
				tile_x,
				tile_y
			);
			objects.push(object);
		}
		return objects;


	}
	app.WorldBase.prototype.toObject = function(){
		var ret = {};
		ret.tiles = {};
		for(var x in this.tiles){
			ret.tiles[x] = {};
			for(var y in this.tiles[x]){

				if(/*this.tiles[x][y] && */this.tiles[x][y].toObject){
					ret.tiles[x][y] = this.tiles[x][y].toObject();
				}
			}
		}
		ret.objects = {};
		for(var object_id in this.objects){
			if(!this.objects[object_id].is_detached()){
				ret.objects[object_id] = this.objects[object_id].toObject();
			}
		}
		return ret;
	}
	app.WorldBase.prototype.load = function(cb){
		var _this = this;
		return app.schema.WorldObject.find({
			world:this._mongo_object._id
		}).exec(function(err, objects){
			if(err) throw err;
			return async.eachSeries(
				objects,
			    function(object, cb){
					process.nextTick(function(){
						var object_data = null
						try{
							object_data = JSON.parse(object.serialized);
						}catch(e){
							throw e;
						}
						if(object_data._is_npc){
							return app.Serializer.deserialize_npc(_this, object_data, function(err, object){
								if(err) throw err;
								//TODO: Prob have to do some more setup here
								return cb();
							});
						}
						return app.Serializer.deserialize_object(_this, object_data, function(err, object){
							if(err) throw err;
							//TODO: Prob have to do some more setup here
							return cb();
						});
					});
			    },
			    function(errs){
					return cb();
			    }
			)

		});
	}
	app.WorldBase.prototype.save = function(cb){
		var _this = this;

		return async.series([
		    function(cb){
				//Iterate through each NPC

				if(!_this._mongo_object){
					_this._mongo_object = new app.schema.World({
						name: "world-" + _this.game.config.world.global_x + '-' + _this.game.config.world.global_y,
						global_x:_this.game.config.world.global_x,
						global_y:_this.game.config.world.global_y
					});
				}
				return app.Serializer.serialize_world(_this, function(err, world_data){
					if(err) throw err;
					_this._mongo_object.serialized = JSON.stringify(world_data);
					return _this._mongo_object.save(function(err){
						if(err) throw err;
						return cb();
					});
				});
			},
			function(cb){

				//Iterate through each object


				return async.eachSeries(
					Object.keys(_this.npcs),
					function(npc_id, cb){
						var npc = _this.npcs[npc_id];
						if(!npc._mongo_object){
							npc._mongo_object = new app.schema.WorldObject({
								world:_this._mongo_object._id
							});
						}
						return app.Serializer.serialize_npc(npc, function(err, npc_data){
							if(err) throw err;

							npc._mongo_object.serialized = JSON.stringify(npc_data);
							return npc._mongo_object.save(function(err){
								if(err) throw err;
								return cb();
							});
						});
					},
					function(errs){
						return cb();
					}
				)
			}
		],
		cb
		);
	}
}
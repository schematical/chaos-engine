var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.World = function(options){
		var default_options = {
			width:100,
			height:100
		}
		options = _.extend(default_options, options)
		var world = new app.WorldBase(options);

		world.deserialize = function(world_data, cb){
			var tiles = _.clone(world_data.tiles);
			var objects = _.clone(world_data.objects);
			delete(world_data.objects);
			_.extend(this, world_data);
			for(var x in tiles){
				if(!world.tiles[x]){
					world.tiles[x] = [];
				}
				for(var y in tiles[x]){
					world.tiles[x][y] = new app.TileBase(tiles[x][y]);
				}
			}
			return async.eachSeries(
				Object.keys(objects),
				function(key, cb){
					var object_data = objects[key];
					return app.Serializer.deserialize_object(world, object_data, function(err, object){
						if(err) throw err;

						for(var i in this.objects){
							var object = this.objects[i];
							if(!object.is_detached){
								console.error(object);
								throw new Error("No method is_detached");
							}
						}
						return cb();
					});

				},
				function(errs){
					return cb();
				}
			)
			/*var promises = [];
			Object.keys(objects).forEach((key)=>{
				var object_data = objects[key];

				if(!object_data._is_npc){
					promises.push(new Promise((resolve, reject) =>{
						return app.Serializer.deserialize_object(world, object_data, function(err, object){
							if(err) return reject(err)
							return resolve();
						});
					}));
				}
			})
			Promise.all(promises)
				.then(()=>{
					var promises = [];
					Object.keys(objects).forEach((key)=>{
						var object_data = objects[key];
						if(object_data._is_npc){
							promises.push(new Promise((resolve, reject) =>{
								return app.Serializer.deserialize_object(world, object_data, function(err, object){
									if(err) return reject(err)

									return resolve();
								});
							}));
						}
					});
					return Promise.all(promises);
			}).then(()=>{
				return cb();
			}).catch(cb)*/

		}

		world.spawn = function(){
			world.width = 25;
			world.height = 25;
			for(var x = 0; x < world.width; x++){
				if(!world.tiles[x]){
					world.tiles[x] = [];
				}
				for(var y = 0; y < world.height; y++){
					var is_border = (x == 0 || x == world.width || y == 0 || y == world.height);


					world.tiles[x][y] = new app.TileBase({
						id:'tile-' + x +'-' + y,
						type:'prison-' + /*((x * 20) + y),*/Math.floor(Math.random() * 15),
						x:x,
						y:y
					});
					//WALLS EXPIREMENTAL
					if(y == 0){
						world.tiles[x][y].addWallTopLeft('stone-left');
					}
				}
			}









			//SETUP DOG
			var dogmeat = new app.npcs.Dogmeat({
				 id:'dogmeat-1',
				 world:world
			 })
			 dogmeat.spawn();
			 dogmeat.setXY(10, 10);


			 var rats = world.spawnRandom(function(index){
				 var rat = new app.npcs.Rat({
					 id:'rat-' + index,
					 world:world
				 });
				 rat.age = Math.floor(Math.random() * rat.biology.life_peak * 2);
				 rat.spawn();
				 return rat;
			 }, world.game.RAT_CT);


			var ants = world.spawnRandom(function(index){
				var ant = new app.npcs.Ant({
					id:'ant-' + index,
					world:world
				});
				ant.age = Math.floor(Math.random() * ant.biology.life_peak * 2);
				ant.spawn();
				return ant;
			}, world.game.ANT_CT);




			var food = this.spawnRandom(function(index){
				var food = new app.objects.food.FruitFactory({
					id:'food-factory-' + index,
					world:world
				});
				return food;
			}, world.game.FOOD_CT);


			var gold = this.spawnRandom(function(index){
				var gold = new app.objects.GoldFactory({
					id:'gold-factory-' + index,
					world:world
				});
				return gold;
			}, world.game.GOLD_CT);







			//SETUP app.objects.Revolver
			var revolver = new app.objects.Revolver({
				id:'revolver-1',
				world: world
			});
			revolver.setXY(4,4);
		}
		return world;

	}

}
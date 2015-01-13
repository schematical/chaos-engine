var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.Serializer = {
		serialize_world:function(world, cb){
			var world_data = {
				tiles:{},
				objects:{}
			};
			async.series([
			    function(cb){

					async.eachSeries(
						Object.keys(world.tiles),
						function(x, cb){
							return process.nextTick(function(){
								world_data.tiles[x] = {};
								async.eachSeries(Object.keys(world.tiles[x]),function(y, cb){
									var tile = world.tiles[x][y];
									var tile_data = {};
									return tile.trigger('serialize', tile_data, function(){
										world_data.tiles[x][y] = tile_data;
										return cb()
									});

								}, cb);
							});
						},
						cb
					)

			    },
				function(cb){


					async.eachSeries(
						Object.keys(world.objects),
						function(object_id, cb){
							var object = world.objects[object_id];
							return process.nextTick(function(){
								var object_data = {};
								return object.trigger('serialize', object_data, function(){
									world_data.objects[object_data.id] = object_data;
									return cb();
								});
							});

						},
						function(errs){
							return cb(null, world_data);
						}
					)
				}
			],
			function(){
			    //end async
				return cb(null, world_data);
			});




		},

		serialize_npc:function(world){

		},
		serialize_object:function(object){
			if(object._is_npc){

			}

		},
		deserialize_world:function(data){

		},
		deserialize_npc:function(world, npc_data, cb){
			if(!app.npcs[npc_data.npc_class]){
				throw new Error("No NPC class '" + npc_data.npc_class + "' in app.npcs");
			}
			//Alter id
			var cloned_npc = new app.npcs[npc_data.npc_class]({
				world:world
			});
			//Deserilize
			return cloned_npc.trigger('deserialize', npc_data, function(){
				return cb(null, cloned_npc);
			});
		}
	}
}
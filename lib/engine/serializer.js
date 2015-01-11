var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.Serilaizer = {
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

		serilize_npc:function(world){

		},
		serilize_object:function(object){
			if(object._is_npc){

			}

		},
		deserilize_world:function(data){

		},
	}
}
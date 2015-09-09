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
								return async.eachSeries(Object.keys(world.tiles[x]),function(y, cb){
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
				/*function(cb){


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
				}*/
			],
			function(){
			    //end async
				return cb(null, world_data);
			});




		},

		serialize_npc:function(npc, cb){
			//Serialize
			var npc_data = {};
			return npc.trigger('serialize', npc_data, function(err){
				if(err) return cb(err);
				return cb(null, npc_data);
			});
		},
		serialize_object:function(object, cb){
			if(object._is_npc){
				return app.LogicNodeBase.serialize_npc(object, cb);
			}

		},
		deserialize_object:function(world, object_data, cb){
			if(!app.objects[object_data.object_class]){
				console.error(object_data);
				throw new Error("No Object class '" + object_data.object_class + "' in app.objects");
			}
			//Alter id
			var cloned_npc = new app.npcs[object_data.object_class]({
				id:object_data.id,
				world:world
			});
			//Deserilize
			return object_data.trigger('deserialize', object_data, function(){
				return cb(null, object_data);
			});
		},
		deserialize_world:function(data, cb){
			var world = new app.World();
			world.deserialize(data);
			return cb(null, world);
		},
		deserialize_npc:function(world, npc_data, cb){
			if(!app.npcs[npc_data.npc_class]){
				throw new Error("No NPC class '" + npc_data.npc_class + "' in app.npcs");
			}
			//Alter id
			var cloned_npc = new app.npcs[npc_data.npc_class]({
				id:npc_data.id,
				world:world
			});
			//Deserilize
			return cloned_npc.trigger('deserialize', npc_data, function(){
				return cb(null, cloned_npc);
			});
		},
		deserialize_logicNodeChain:function(npc, logicNodeChain, cb){
			console.log("Starting to deserialize:", logicNodeChain.type);
			var NodeClass = app.logic.inputs[logicNodeChain.type];
			if(!NodeClass){
				var NodeClass = app.logic.outputs[logicNodeChain.type];
				if(!NodeClass){
					console.log( logicNodeChain);
					throw new Error("Invalid Input Node Class: " + logicNodeChain.type);
				}
			}

			var finished = false;
			var input_node_chain_count = 0;
			logicNodeChain.npc = npc;
			var logicNodeChain_fresh = _.clone(logicNodeChain);
			delete(logicNodeChain_fresh._outputNode);
			delete(logicNodeChain_fresh._chainedInputNode);
			delete(logicNodeChain_fresh._fail_node);
			delete(logicNodeChain_fresh._success_node);
			//MATT: ADD Target HERE???
			var node = new NodeClass(logicNodeChain_fresh);
			return async.series([
				function(cb){
					if(!logicNodeChain._outputNode){
						return cb();
					}
					return app.Serializer.deserialize_logicNodeChain(npc, logicNodeChain._outputNode, function(err, logic_node){
						if(err) throw err;
						if(node._outputNode){
							console.error(Object.keys(logicNodeChain_fresh));
						}
						node.outputNode(logic_node);
						return cb();
					});
				},
				function(cb){
					if(!logicNodeChain._chainedInputNode){
						return cb();
					}
					return app.Serializer.deserialize_logicNodeChain(npc, logicNodeChain._chainedInputNode,  function(err, logic_node){
						if(err) throw err;
						if(!node.chainInput){
							console.error(node);
						}
						node.chainInput(logic_node);
						return cb();
					});

				},
				function(cb){
					if(!logicNodeChain._success_node){
						return cb();
					}
					app.Serializer.deserialize_logicNodeChain(npc, logicNodeChain._success_node,  function(err, logic_node){
						if(err) throw err;
						node.success_node(logic_node);
						return cb();
					});
				},
				function(cb){
					if(!logicNodeChain._fail_node){
						return cb();
					}
					app.Serializer.deserialize_logicNodeChain(npc, logicNodeChain._fail_node, function(err, logic_node){
						if(err) throw err;
						node.fail_node(logic_node);
						return cb();
					});
				}
			],
			function(){
				return cb(null, node);
			});

		}
	}
}
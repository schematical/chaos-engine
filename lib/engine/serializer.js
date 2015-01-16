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
				id:npc_data.id,
				world:world
			});
			//Deserilize
			return cloned_npc.trigger('deserialize', npc_data, function(){
				return cb(null, cloned_npc);
			});
		},
		deserialize_logicNodeChain:function(npc, logicNodeChain, cb){
			var NodeClass = app.logic.inputs[logicNodeChain.type];
			if(!NodeClass){
				var NodeClass = app.logic.outputs[logicNodeChain.type];
				if(!NodeClass){
					console.log( logicNodeChain);
					throw new Error("Invalid Input Node Class: " + logicNodeChain.type);
				}
			}
			var node_data = logicNodeChain;
			var finished = false;
			var input_node_chain_count = 0;
			logicNodeChain.npc = npc;
			var logicNodeChain_fresh = _.clone(logicNodeChain);
			delete(logicNodeChain_fresh._outputNode);
			delete(logicNodeChain_fresh._chainedInputNode);
			delete(logicNodeChain_fresh._fail_node);
			delete(logicNodeChain_fresh._success_node);
			var node = new NodeClass(logicNodeChain_fresh);
			return async.doUntil(function(cb){
				if(node_data._outputNode){
					app.Serializer.deserialize_logicNodeChain(npc, node_data._outputNode, function(err, logic_node){
						if(err) throw err;
						node.outputNode(logic_node);
						return cb();
					});
				}else if(node_data._chainedInputNode){
					app.Serializer.deserialize_logicNodeChain(npc, node_data._chainedInputNode,  function(err, logic_node){
						if(err) throw err;
						node.inputNode(logic_node);
						return cb();
					});
				}else if(node_data._success_node || node_data._fail_node){
					async.series([
						function(cb){
							if(!node_data._success_node){
								return cb();
							}
							app.Serializer.deserialize_logicNodeChain(npc, node_data._success_node,  function(err, logic_node){
								if(err) throw err;
								node.success_node(logic_node);
								return cb();
							});
						},
						function(cb){
							if(!node_data._fail_node){
								return cb();
							}
							app.Serializer.deserialize_logicNodeChain(npc, node_data._fail_node, function(err, logic_node){
								if(err) throw err;
								node.fail_node(logic_node);
								return cb();
							});
						}
					],
					function(){
						return cb();
					});

				}else{
					finished = true;
				}

				input_node_chain_count += 1;
				return cb();
			},
			function(){
				return finished || input_node_chain_count > 10;
			},
			function(){
				//Finnally

				//throw new Error("Look up");
				return cb(null, node);
			});


		}
	}
}
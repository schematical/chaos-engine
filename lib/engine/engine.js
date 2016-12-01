var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.Engine = class Engine {
		constructor(options) {


			this.users = {};
			this.spawn_point = {
				x: 4,
				y: 4
			}

			_.extend(this, options);
			/*if(!this.world){
			 this.loadWorld();
			 //throw new Error("No world object set");
			 }
			 this.world.game = this;*/
			return this;
		}

		reset(cb) {
			var _this = this;
			var world_objects = null;
			return async.series([
					function (cb) {
						return app.schema.WorldObject.find({
							//world:_this.world._mongo_object._id
						}).exec(function (err, _world_objects) {
							if (err) return cb(err);
							world_objects = _world_objects;
							return cb();
						});
					},
					function (cb) {
						return async.eachSeries(
							world_objects,
							function (world_object, _cb) {
								return world_object.remove(function (err) {
									if (err) return _cb(err);
									return _cb();
								});
							},
							function (errs) {

								return cb();
							}
						)
					},
					function (cb) {
						return app.schema.World.findOne({
							//world:_this.world._mongo_object._id
						}).exec(function (err, world) {
							if (err) return cb(err);
							return world.remove(function (err) {
								if (err) throw (err);
								return cb();
							});
						});
					},
					function (cb) {
						_this.world = new app.World();
						_this.world.game = _this;
						_this.world.spawn();
						return cb();
					}
				],

				function () {
					//end async
					return cb();
				});


		}

		loadWorld(cb) {
			var _this = this;
			return app.schema.World.findOne({
				global_x: this.config.world.global_x,
				global_y: this.config.world.global_y
			}).exec(function (err, world_mongo) {
				if (err) throw err;
				if (!world_mongo) {
					_this.world = new app.World();
					_this.world.game = _this;
					_this.world.spawn();
					return cb();
					throw new Error("No such world exists");
				}

				var world_data = null;
				try {
					world_data = JSON.parse(world_mongo.serialized);
				} catch (e) {
					throw e;
				}
				if (!world_data || !_.isObject(world_data)) {
					throw new Error("World data invalid. Null or Not an object");
				}
				return app.Serializer.deserialize_world(world_data, function (err, world) {
					if (err) throw err;
					world.game = _this;
					world._mongo_object = world_mongo;
					_this.world = world;

					return world.load(cb)
				});
			});
		}

		connect_user(socket) {

			//console.log('a user connected');
			socket.emit('hello', {});


			socket.on('greet', _.bind(function (data) {

				//this.users[]
				if (!data.user || !this.users[data.user]) {
					//Create new User
					var new_user_id = 'user-' + Math.floor(Math.random() * 1000);

					//Create Player Object
					var player = new app.npcs.PlayerBase({
						id: 'player-' + new_user_id,
						world: this.world
					});
					player.setXY(this.spawn_point.x, this.spawn_point.y);
					this.users[new_user_id] = new app.User({
						id: new_user_id,
						player_object: player
					});
					//Create a cherictor object to control
					socket.emit('create-user', {user: new_user_id, view_port_focus: player.id});

				}

				this.users[new_user_id || data.user].bindSocket(socket);
				socket.emit('refresh-world', this.world.toObject());
			}, this));


		}

		init() {
			/*for(var i in this.users){
			 this.users[i].broadcast('init-world', {});
			 }*/
			var _cycle = _.bind(function () {
				//Cycle the world
				this.world.cycle(_.bind(function () {
					//Push out updates
					var update_data = this.world.get_updates();
					/* Broadcast update to users */
					for (var i in this.users) {
						this.users[i].broadcast('update-world', update_data);
					}
					return setTimeout(_cycle, 1000);
				}, this));
			}, this)
			return setTimeout(_cycle, 1000);
		}
	}
}
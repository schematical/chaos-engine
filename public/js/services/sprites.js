angular.module('chaos_engine')
	.service(
		'ObjectCache',
		[
			'$q',
			'ObjectCacheData',
			'SpriteSheet',
			'ObjectClass',
			function ($q, ObjectCacheData, SpriteSheet, ObjectClass) {
				var _ObjectCache = {
					cached_images: {},
					cached_objects: {},
					loadImage: function (url, callback) {

						if (_ObjectCache.cached_images[url]) {
							return callback(null, _ObjectCache.cached_images[url]);
						}
						var image = new Image();
						_ObjectCache.cached_images[url] = image;

						image.src = url
						image.onload = function () {
							return callback(null, _ObjectCache.cached_images[url]);
						}
					},
					storeInImageCache: function (url, image) {
						if (!image.src) {
							throw new Error("Not a valid image");
						}
						_ObjectCache.cached_images[url] = image;
					},
					loadObject: function (type) {
						if (!_ObjectCache.cached_objects[type]) {
							if (!ObjectCacheData[type]) {
								return null;
							}

							//This actually creates proper animations and caches them
							_ObjectCache.cached_objects[type] = new ObjectClass({
								cache: this,
								type: type
							});
						}
						return _ObjectCache.cached_objects[type];

					},
					createNewObjectInstance: function (instance_data) {

						var objectClass = _ObjectCache.loadObject(instance_data.type);
						if (!objectClass) {
							return null;
						}
						var instance = objectClass.createNewInstance(instance_data);
						return instance;
					},
					preload: function () {
						//Iterate through the ObjectCacheData
						/*var promisses = [];
						 for (var type in ObjectCacheData) {
						 promisses.push(_ObjectCache.loadObject(type));
						 }
						 return $q.all(promisses);*/

					}/*,
					 old_preload: function () {
					 var spriteSheet1 = new SpriteSheet({
					 img_src: '/imgs/tiles/prison_floor.png',
					 tile_width: 75,
					 tile_height: 38
					 });
					 spriteSheet1.load(function (err, image) {
					 for (var x = 0; x < 4; x++) {
					 for (var y = 0; y < 10; y++) {
					 var i = (x * 10) + y;


					 //_ObjectCache.storeInCache(spriteSheet1.getTile(x, y);
					 }
					 }
					 });
					 _ObjectCache.cached_images['player-1'] = {};
					 _ObjectCache.cached_images['player-1']['default'] = new Image();
					 _ObjectCache.cached_images['player-1']['default'].src = '/imgs/player/default.bmp';


					 _ObjectCache.cached_images['beretta'] = {};
					 _ObjectCache.cached_images['beretta']['default'] = new Image();
					 _ObjectCache.cached_images['beretta']['default'].src = '/imgs/objects/gun.bmp';


					 }*/
				}

				return _ObjectCache;
			}
		]
	)

/**
 * This is like a template for a 'type' of object
 */
	.factory('ObjectClass', [
		'$q',
		'ObjectInstance',
		'ObjectCacheData',
		'AnimationFactory',
		function ($q, ObjectInstance, ObjectCacheData, AnimationFactory) {
			var _ObjectClass = function (options) {
				this.cache = options.cache;
				this.type = options.type;
				this.data = ObjectCacheData[this.type];
				this._preloaded = true;
				return this;
			}
			/**
			 * Will return a $q.promise
			 */
			_ObjectClass.prototype.preload = function () {
				var promisses = []
				for (var state in ObjectCacheData[type]) {
					for (var facing in ObjectCacheData[type][state]) {
						promisses.push(this.cache.loadImage(ObjectCacheData[type][state][facing].src));
					}
				}
				this._preloaded = true;
				return $q.all(promisses);
			}
			/**
			 * Should return an animation object
			 * @param state
			 * @param facing
			 */
			_ObjectClass.prototype.getRenderable = function (state, facing) {
				if(!this.data[state]){
					state = 'default';
				}
				if(this.data[state] && this.data[state][facing]){
					return new AnimationFactory(this.data[state][facing]);
				}
				return null;
			}
			/**
			 * Creates a new instance of the ObjectClass
			 * @param object_data
			 */
			_ObjectClass.prototype.createNewInstance = function (instance_data) {
				if (this.data.custom_instance) {
					//Create a custom instance
					console.error("Matt Write this");
				}
				if (!this._preloaded) {
					//this.preload
				}
				return new ObjectInstance({
					object: instance_data,
					class: this
				})

			}
			return _ObjectClass;
		}
	])
	.factory('ObjectInstance', [
		'$q',
		function ($q) {
			var _ObjectInstance = function (options) {
				this.class = options.class;
				this.x_offset = 0;
				this.y_offset = 0;
				this.update(options.object);


				return this;
			}
			_ObjectInstance.prototype = {
				get id(){
					return this.object.id;
				},
				get name(){
					return this.object.name;
				},
				get health(){
					return this.object.health;
				},
				get race(){
					return this.object.race;
				},
				get type(){
					return this.object.type;
				},
				get gender(){
					return this.object.gender;
				},
				get state(){
					return this.local_state;
				},
				get age(){
					return this.object.age;
				},
				get nourishment(){
					return this.object.nourishment;
				},
				get x(){
					return this.object.x;
				},
				get y(){
					return this.object.y;
				},
				get detached(){
					return this.object.detached;
				}
			}
			//TODO: Probably define getters for (type, x,y,z,state, etc)
			/**
			 * Returns the correct frame for its state... hopefully
			 */
			_ObjectInstance.prototype.render = function () {
				if(!this.animation){
					console.log("No animation found for:" + this.class.type + ' - ' + this.object.state+ ' - ' + this.object.facing);
					return null;
				}
				//Assuming the frame rate is still roughly 5 per second
				if(this.x_offset == 0){
				}else if(Math.abs(this.x_offset) < .2){
					this.x_offset = 0;
					this.local_state = this.object.state;
				}else if(this.x_offset > 0){
					this.x_offset -= .2;
				}else{
					this.x_offset += .2;
				}

				if(this.y_offset == 0){
				}else if(Math.abs(this.y_offset) < .2){
					this.local_state = this.object.state;
					this.y_offset = 0;
				}else if(this.y_offset > 0){
					this.y_offset -= .2;
				}else{
					this.y_offset += .2;
				}
				return this.animation.render();
			}
			/**
			 * Updates the object instances state and animation
			 */
			_ObjectInstance.prototype.update = function (instance_data) {
				//First check to see the vars that trigger an animation change
				if (
					(!this.object) ||
					(instance_data.state != this.object.state)
				) {
					this.local_state = instance_data.state;
					//Trigger new animation

					this.animation = this.class.getRenderable(
						this.local_state,
						instance_data.facing
					);

				} else if (
					(instance_data.x != this.object.x) ||
					(instance_data.y != this.object.y)
				) {
					this.x_offset = instance_data.x - this.object.x;
					this.y_offset = (instance_data.y - this.object.y) * 1;
					this.local_state = 'walking';
					this.animation = this.class.getRenderable(
						this.state,
						instance_data.facing
					);
				}else if(instance_data.facing != this.object.facing){
					this.animation = this.class.getRenderable(
						this.local_state,
						instance_data.facing
					);
				}
				this.object = instance_data;
			}

			return _ObjectInstance;
		}
	])

	.service('TileCache',
		[
			'TileCacheData',
			function (TileCacheData) {
				var _TileCache = {
					tile_image_cache: {},
					initTileInstance: function (tile_instance) {
						var image = null;
						if (_TileCache.tile_image_cache[tile_instance.type]) {
							image = _TileCache.tile_image_cache[tile_instance.type];
						} else {
							image = new Image();
							if (!TileCacheData[tile_instance.type]) {
								console.log(tile_instance);
								return null;
							}
							image.src = TileCacheData[tile_instance.type].src;
							_TileCache.tile_image_cache[tile_instance.type] = image;
						}
						tile_instance.image = image;
						return tile_instance;

					}
				}
				return _TileCache;
			}
		])

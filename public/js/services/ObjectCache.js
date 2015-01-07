angular.module('chaos_engine')
	.service(
		'ObjectCache',
		[
			'$q',
			'ObjectCacheData',
			'SpriteSheet',
			function ($q, ObjectCacheData, SpriteSheet) {
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
						//This actually creates proper animations and caches them
						_ObjectCache.cached_objects[type] = new ObjectClass({
							cache: this,
							type: type
						});
						var promise = _ObjectCache.cached_objects[type].preload(ObjectCache);
						return promise;
					},
					preload: function () {
						//Iterate through the ObjectCacheData
						var promisses = [];
						for (var type in ObjectCacheData) {
							promisses.push(_ObjectCache.loadObject(type));
						}
						return $q.all(promisses);

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
		function ($q, ObjectCacheData) {
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
				this.object = options.object;
				this.local_state = this.object.state;
				this.animation = null;
				return this;
			}
			//TODO: Probably define getters for (type, x,y,z,state, etc)
			/**
			 * Returns the correct frame for its state... hopefully
			 */
			_ObjectInstance.prototype.render = function () {
				return this.animation.render();
			}
			/**
			 * Updates the object instances state and animation
			 */
			_ObjectInstance.prototype.update = function (instance_data) {
				//First check to see the vars that trigger an animation change
				if (
					(instance_data.state != this.object.state) ||
						(instance_data.facing != this.object.facing)
					) {
					this.local_state = this.object.state;
					//Trigger new animation

					this.animation = this.class.getRenderable(
						this.object.local_state,
						this.object.facing
					);

				} else if (
					(instance_data.state != this.object.state) ||
						(instance_data.facing != this.object.facing)
					) {
					this.local_state = 'walking';
					this.animation = this.class.getRenderable(
						this.object.state,
						this.object.facing
					);
				}
				this.object = instance_data;
			}

			return _ObjectInstance;
		}
])
.service(
	'ObjectCacheData',
	[
		function () {
			return {"player-1": {"default": {"up": {"frames": [
				{"x": 0, "y": 0, "width": 46, "height": 38},
				{"x": 46, "y": 0, "width": 46, "height": 38},
				{"x": 46, "y": 0, "width": 46, "height": 38},
				{"x": 92, "y": 0, "width": 46, "height": 38},
				{"x": 92, "y": 0, "width": 46, "height": 38},
				{"x": 138, "y": 0, "width": 46, "height": 38},
				{"x": 138, "y": 0, "width": 46, "height": 38},
				{"x": 184, "y": 0, "width": 46, "height": 38},
				{"x": 184, "y": 0, "width": 46, "height": 38},
				{"x": 230, "y": 0, "width": 46, "height": 38},
				{"x": 230, "y": 0, "width": 46, "height": 38},
				{"x": 276, "y": 0, "width": 46, "height": 38},
				{"x": 276, "y": 0, "width": 46, "height": 38},
				{"x": 322, "y": 0, "width": 46, "height": 38},
				{"x": 322, "y": 0, "width": 46, "height": 38},
				{"x": 368, "y": 0, "width": 46, "height": 38},
				{"x": 368, "y": 0, "width": 46, "height": 38},
				{"x": 414, "y": 0, "width": 46, "height": 38},
				{"x": 414, "y": 0, "width": 46, "height": 38}
			], "src": "/imgs/npcs/dogmeat.gif"}, "right": {"frames": [
				{"x": 0, "y": 38, "width": 46, "height": 38},
				{"x": 46, "y": 38, "width": 46, "height": 38},
				{"x": 92, "y": 38, "width": 46, "height": 38},
				{"x": 138, "y": 38, "width": 46, "height": 38},
				{"x": 184, "y": 38, "width": 46, "height": 38},
				{"x": 230, "y": 38, "width": 46, "height": 38},
				{"x": 276, "y": 38, "width": 46, "height": 38},
				{"x": 322, "y": 38, "width": 46, "height": 38},
				{"x": 368, "y": 38, "width": 46, "height": 38},
				{"x": 414, "y": 38, "width": 46, "height": 38}
			], "src": "/imgs/npcs/dogmeat.gif"}, "down": {"frames": [
				{"x": 46, "y": 38, "width": 46, "height": 38},
				{"x": 0, "y": 76, "width": 46, "height": 38},
				{"x": 46, "y": 76, "width": 46, "height": 38},
				{"x": 92, "y": 76, "width": 46, "height": 38},
				{"x": 138, "y": 76, "width": 46, "height": 38},
				{"x": 184, "y": 76, "width": 46, "height": 38},
				{"x": 230, "y": 76, "width": 46, "height": 38},
				{"x": 276, "y": 76, "width": 46, "height": 38},
				{"x": 322, "y": 76, "width": 46, "height": 38},
				{"x": 368, "y": 76, "width": 46, "height": 38},
				{"x": 414, "y": 76, "width": 46, "height": 38}
			], "src": "/imgs/npcs/dogmeat.gif"}, "left": {"frames": [
				{"x": 0, "y": 152, "width": 46, "height": 38},
				{"x": 46, "y": 152, "width": 46, "height": 38},
				{"x": 92, "y": 152, "width": 46, "height": 38},
				{"x": 138, "y": 152, "width": 46, "height": 38},
				{"x": 184, "y": 152, "width": 46, "height": 38},
				{"x": 230, "y": 152, "width": 46, "height": 38},
				{"x": 276, "y": 152, "width": 46, "height": 38},
				{"x": 322, "y": 152, "width": 46, "height": 38},
				{"x": 368, "y": 152, "width": 46, "height": 38},
				{"x": 414, "y": 152, "width": 46, "height": 38}
			], "src": "/imgs/npcs/dogmeat.gif"}}}}
		}
	]
)
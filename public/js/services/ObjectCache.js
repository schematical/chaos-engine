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
						if(!_ObjectCache.cached_objects[type]){


							//This actually creates proper animations and caches them
							_ObjectCache.cached_objects[type] = new ObjectClass({
								cache: this,
								type: type
							});
						}
						return _ObjectCache.cached_objects[type];

					},
					createNewObjectInstance:function(instance_data){

						var objectClass = _ObjectCache.loadObject(instance_data.type);
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
		function ($q, ObjectInstance, ObjectCacheData) {
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
			return {"player-1":{"default":{"up":{"frames":[{"x":0,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,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"},{"x":46,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":92,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":138,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":184,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":230,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":276,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":322,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":368,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":414,"y":0,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"}],"src":"/imgs/npcs/dogmeat.gif"},"left":{"frames":[{"x":0,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":46,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":92,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":92,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":138,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":138,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":184,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":184,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":230,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":230,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":276,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":276,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":322,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":322,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":368,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":368,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":414,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":414,"y":38,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":0,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":46,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":92,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":138,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":184,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":230,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":276,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":322,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":368,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="},{"x":414,"y":180,"width":46,"height":35,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAAa0lEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4vkT5OnO0bNH7z1d/PfLJZ44FOirQChtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUOJQyhtlrhGCUMP4KAAJMOzOjMAAAAASUVORK5CYII="}],"src":"/imgs/npcs/dogmeat.gif"},"down":{"frames":[{"x":0,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":46,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":92,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":138,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":184,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":230,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":276,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":322,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":368,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"},{"x":414,"y":76,"width":46,"height":38,"data_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAcklEQVRYR+3SwQkAIAzF0Hb/pV0hhyAU4jl85OnO0bNH7z1d/PfLJZ44FOirQCgtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtS1yjhEOJQygtOyv+ADMRACdHbuHJAAAAAElFTkSuQmCC"}],"src":"/imgs/npcs/dogmeat.gif"}}}}
		}
	]
)
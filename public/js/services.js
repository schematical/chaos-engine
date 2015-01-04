angular.module('wheezy')
	.factory(
		'SpriteSheet',
		[
			function () {
				var _spriteSheet = function (options) {
					this.img_src = options.img_src;
					this.x_offset = options.x_offset || 0;
					this.y_offset =  options.y_offset || 0;
					this.tile_width = options.tile_width;
					this.tile_height = options.tile_height;
					this.image = null;

					return this;
				}
				_spriteSheet.prototype.getTile = function (x, y) {
					if (!this.canvas) {
						this.canvas = document.createElement('canvas');
						this.canvas.width = this.tile_width;
						this.canvas.height = this.tile_height;
						this.ctx = this.canvas.getContext('2d');
					}
					this.ctx.drawImage(
						this.image,
						(x * this.tile_width) + this.x_offset,
						(y * this.tile_height) + this.y_offset,
						this.tile_width,
						this.tile_height,
						0,
						0,
						this.tile_width,
						this.tile_height
					);
					var tImage = new Image();
					tImage.src = this.canvas.toDataURL();
					return tImage;

				}
				_spriteSheet.prototype.load = function (callback) {
					//Append canvas
					this.image = new Image();
					this.image.onload = function () {
						return callback(null, this.image);
					}
					this.image.src = this.img_src;
				}

				return _spriteSheet
			}
		]
	).service(
		'Socket',
		[
			'$rootScope',
			'$cookies',
			'GameScreen',
			'WorldCache',
			function ($rootScope, $cookies, GameScreen, WorldCache) {

				var socket = window.io();
				socket.on('hello', function (data) {
					//console.log($cookies);
					socket.emit('greet', { user: $cookies.user /*$cookieStore.get('user')*/ });
				});
				socket.on('create-user', function (data) {

					//Create cookie
					//console.log(data.user);
					//$cookieStore.remove('user');
					//$cookieStore.put('user', data.user);
					$cookies.user = data.user;
					$rootScope.$digest();

				});
				socket.on('refresh-world', function (data) {


					WorldCache.init(data);
					GameScreen.render_world();

				});
				socket.on('update-world', function (data) {

					//console.log("Updateing WOrld:", data);
					WorldCache.update(data);
					GameScreen.render_world();

				});
				/** Setup for user generated events */

				$rootScope.$on('keypress', function (e, a, key) {
					console.log(key);
					switch(key){
						case('s'):
							//Trigger Down
							socket.emit('user-input', {
								action:'player.move.down'
							})
						break;
						case('d'):
							//Trigger Down
							socket.emit('user-input', {
								action:'player.move.right'
							})
							break;
						case('a'):
							//Trigger Down
							socket.emit('user-input', {
								action:'player.move.left'
							})
							break;
						case('w'):
							//Trigger Down

							socket.emit('user-input', {
								action:'player.move.up'
							})
							break;
						case('e'):
							//Figure out what the user is trying to interact with
							socket.emit('user-input', {
								action:'player.interact'
							})
							break;
					}
					/*$scope.$apply(function () {
						$scope.key = key;
					});*/
				})
				return socket;
			}
		]
	)
/**
 * Caches world data for quicker socket communitication
 */
	.service(
		'WorldCache',
		[


			function () {
				var _WorldCache ={
					world:null,
					init:function(data){
						_WorldCache.world = data;
					},
					update:function(data){
						for(var object_id in data.objects){
							_WorldCache.world.objects[object_id] = data.objects[object_id];
						}
					}
				}
				return _WorldCache;
			}
		]
	)
	.service(
		'GameScreen',
		[
			'ObjectCache',
			'WorldCache',

			function (ObjectCache, WorldCache) {
				var _GameScreen = function (options) {
					this.view_port = {
						x: 0,
						y: 0,
						z: 0
					}
					this.gameArea = document.getElementById('gameArea');
					if (!this.gameArea) {
						throw new Error("Game Area Element not found");
					}
					this.gameCanvas = document.getElementById('gameCanvas');
					this.widthToHeight = 4 / 3;
					this.tile_width = 25;

					this.gameContext = this.gameCanvas.getContext("2d");
					var _this = this;
					window.addEventListener('resize', function () {
						_this.resize()
					}, false);
					window.addEventListener('orientationchange', function () {
						_this.resize()
					}, false);
				}
				_GameScreen.prototype.set_viewport = function (x, y, z) {
					this.view_port.x = x;
					this.view_port.y = y;
					this.view_port.z = z;
				}
				_GameScreen.prototype.render_world = function () {
					var world = WorldCache.world;
					var _this = this;
					var view_radius = 40;
					for (var x = this.view_port.x - view_radius; x < this.view_port.x + view_radius; x++) {
						if(world.tiles[x]){

							for (var y = this.view_port.y - view_radius; y < this.view_port.y + view_radius; y++) {
								if(world.tiles[x][y]){

									var tile = world.tiles[x][y];

									ObjectCache.loadImage(tile.type, tile.state, function (err, image) {

										_this.gameContext.drawImage(
											image,
											x * _this.tile_width,
											y * _this.tile_width,
											_this.tile_width,
											_this.tile_width
										);
									});
								}
							}
						}
					}
					for (var i in world.objects) {
						if( world.objects[i]){

							var object =  world.objects[i];

							ObjectCache.loadImage(object.type, object.state, function (err, image) {

								_this.gameContext.drawImage(
									image,
									object.x * _this.tile_width,
									object.y * _this.tile_width,
									_this.tile_width,
									_this.tile_width
								);
							});
						}
					}
				}
				_GameScreen.prototype.render = function () {

				}
				_GameScreen.prototype.resize = function () {
					var newWidth = window.innerWidth;
					var newHeight = window.innerHeight;
					var newWidthToHeight = newWidth / newHeight;
					if (newWidthToHeight > this.widthToHeight) {
						// window width is too wide relative to desired game width
						newWidth = newHeight * this.widthToHeight;
						this.gameArea.style.height = newHeight + 'px';
						this.gameArea.style.width = newWidth + 'px';
					} else { // window height is too high relative to desired game height
						newHeight = newWidth / this.widthToHeight;
						this.gameArea.style.width = newWidth + 'px';
						this.gameArea.style.height = newHeight + 'px';
					}
					this.gameArea.style.marginTop = (-newHeight / 2) + 'px';
					this.gameArea.style.marginLeft = (-newWidth / 2) + 'px';
					this.gameArea.style.fontSize = (newWidth / 400) + 'em';

					this.gameCanvas.width = newWidth;
					this.gameCanvas.height = newHeight;
				}
				var gameScreen = new _GameScreen();
				gameScreen.resize();
				return gameScreen;

			}
		]
	)
	.factory(
		'ObjectCache',
		[
			'SpriteSheet',
			function (SpriteSheet) {
				var _ObjectCache = {
					cached: {},
					loadImage: function (type, state, callback) {

						if (_ObjectCache.cached[type] && _ObjectCache.cached[type][state]) {
							return callback(null, _ObjectCache.cached[type][state]);
						}
						var image = new Image();
						if (!_ObjectCache.cached[type]) {
							_ObjectCache.cached[type] = {};
						}
						_ObjectCache.cached[type][state] = image;

						image.src = _ObjectCache.map(type, state);
						image.onload = function () {
							return callback(null, _ObjectCache.cached[type][state]);
						}
					},
					map: function (type, state) {


						return '/imgs/' + type + '/' + state + '.jpg';
					},
					preload: function () {


						var spriteSheet1 = new SpriteSheet({
							img_src: '/imgs/tiles/spriteSheet1.jpg',
							tile_width: 26,
							tile_height: 26,
							x_offset: 5,
							y_offset: 5
						});
						spriteSheet1.load(function (err, image) {
							for(var x = 0; x < 20; x++){
								for(var y = 0; y < 20; y++){
									var i = (x * 20) + y;

									_ObjectCache.cached['tile-' + i] = {};
									_ObjectCache.cached['tile-' + i]['default'] = spriteSheet1.getTile(x, y);
								}
							}
						});
						_ObjectCache.cached['player-1'] = {};
						_ObjectCache.cached['player-1']['default'] = new Image();
						_ObjectCache.cached['player-1']['default'].src = '/imgs/player/default.bmp';

						_ObjectCache.cached['the_blind_dog'] = {};
						_ObjectCache.cached['the_blind_dog']['default'] = new Image();
						_ObjectCache.cached['the_blind_dog']['default'].src = '/imgs/npcs/the_blind_dog/default.bmp';

						_ObjectCache.cached['beretta'] = {};
						_ObjectCache.cached['beretta']['default'] = new Image();
						_ObjectCache.cached['beretta']['default'].src = '/imgs/objects/gun.bmp';


					}
				}
				return _ObjectCache;
			}
		]
	)
.directive('shortcut', ['$document', '$rootScope', function($document, $rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		link:    function postLink(scope, iElement, iAttrs){

			$document.bind('keypress', function(e) {
				//document.onkeypress = function (e) {

				$rootScope.$broadcast('keypress',e , String.fromCharCode(e.which));
			});
		}
	};
}]);

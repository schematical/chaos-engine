angular.module('wheezy')
	.factory(
		'SpriteSheet',
		[
			function () {
				var _spriteSheet = function (options) {
					this.img_src = options.img_src;
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
						x * this.tile_width,
						y * this.tile_height,
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
			'$cookies',
			'$cookieStore',
			'GameScreen',
			function ($cookies, $cookieStore, GameScreen) {
				var socket = window.io();
				socket.on('hello', function (data) {

					socket.emit('greet', { user: $cookieStore.user });
				});
				socket.on('create-user', function (data) {

					//Create cookie
					$cookies.user = data.user;

				});
				socket.on('refresh-world', function (data) {

					console.log("Init WOrld:", data);
					GameScreen.render_world(data);

				});
				return socket;
			}
		]
	).service(
		'GameScreen',
		[
			'ObjectCache',

			function (ObjectCache) {
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
				_GameScreen.prototype.render_world = function (world) {
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
							tile_width: 25,
							tile_height: 25
						});
						spriteSheet1.load(function (err, image) {
							_ObjectCache.cached['tile-1'] = {};
							_ObjectCache.cached['tile-1']['default'] = spriteSheet1.getTile(4, 4);
						});
					}
				}
				return _ObjectCache;
			}
		]
	)


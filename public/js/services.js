angular.module('chaos_engine')
	.factory(
		'SpriteSheet',
		[
			function () {
				var _spriteSheet = function (options) {
					this.img_src = options.img_src;
					this.x_offset = options.x_offset || 0;
					this.y_offset = options.y_offset || 0;
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
				return {
					init: function (config) {

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
							$cookies.view_port_focus = data.view_port_focus;
							$rootScope.$digest();

						});
						socket.on('refresh-world', function (data) {
							GameScreen.set_viewport_focus($cookies.view_port_focus);

							WorldCache.init(data);
							GameScreen.startRendering();

						});
						socket.on('update-world', function (data) {


							WorldCache.update(data);


						});
						/** Setup for user generated events */

						$rootScope.$on('keypress', function (e, a, key) {
							if (GameScreen.modal) {
								//Pass control to the modal
								return GameScreen.modal.apply(key);

							}
							switch (key) {
								case('s'):
									//Trigger Down
									socket.emit('user-input', {
										action: 'player.move.down'
									})
									break;
								case('d'):
									//Trigger Down
									socket.emit('user-input', {
										action: 'player.move.right'
									})
									break;
								case('a'):
									//Trigger Down
									socket.emit('user-input', {
										action: 'player.move.left'
									})
									break;
								case('w'):
									//Trigger Down

									socket.emit('user-input', {
										action: 'player.move.up'
									})
									break;
								case('e'):
									//Figure out what the user is trying to interact with
									socket.emit('user-input', {
										action: 'player.interact'
									})
									break;
								case('i'):
									/*//Display the inventory Modal
									GameScreen.showModal(new InventoryModal({
										ingest: function (inventory_object) {
											socket.emit('user-input', {
												action: 'player.ingest',
												object: inventory_object
											})
										}
									}));
*/
									break;
							}

							/*$scope.$apply(function () {
							 $scope.key = key;
							 });*/
						})
						return socket;
					}
				}
			}
		]
	)
/**
 * Caches world data for quicker socket comunitication
 */
	.service(
		'WorldCache',
		[
			'ObjectCache',
			'TileCache',

			function (ObjectCache, TileCache) {
				var _WorldCache = {
					world: null,
					_listeners:{},
					on:function(event, callback){
						if(!_WorldCache._listeners[event]){
							_WorldCache._listeners[event] = [];
						}
						_WorldCache._listeners[event].push(callback);
					},
					trigger:function(event, data){
						for(var i in _WorldCache._listeners[event]){
							_WorldCache._listeners[event][i](data);
						}
					},
					init: function (data) {
						//First init the objects
						_WorldCache.world = {
							objects:{},
							tiles:{}
						}
						for(var object_id in data.objects){
							var instance = ObjectCache.createNewObjectInstance(data.objects[object_id]);
							if(!instance){
								console.log("No object class for:" + object_id);
							}else{
								_WorldCache.world.objects[object_id] = instance;
							}
						}
						//Quick clone for now:
						for(var x in  data.tiles){
							if(!_WorldCache.world.tiles[x]){
								_WorldCache.world.tiles[x] = {}
							}
							for(var y in  data.tiles[x]){
								_WorldCache.world.tiles[x][y] = TileCache.initTileInstance(data.tiles[x][y]);
							}
						}

					},
					update: function (data) {
						for (var object_id in data.objects) {
							if(_WorldCache.world.objects[object_id]){
								_WorldCache.world.objects[object_id].update(data.objects[object_id]);
							}else{

								var instance = ObjectCache.createNewObjectInstance(data.objects[object_id]);
								if(!instance){
									//console.log("No object class for:" + object_id);
								}else{

									_WorldCache.world.objects[object_id] = instance;
								}
							}
						}
						_WorldCache.trigger('update', _WorldCache.world);
					}
				}
				return _WorldCache;
			}
		]
	)
	.service(
		'GameScreen',
		[
			'$timeout',
			'ObjectCache',
			'WorldCache',
			'TileCache',

			function ($timeout, ObjectCache, WorldCache, TileCache) {
				var _GameScreen = function (options) {
					this.view_radius = 40;
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

					this.widthToHeight = 2 / 1;
					this.tile_width = 75;
					this.tile_height = 38;
					this.selected_tile = {
						x:-1,
						y:-1
					};

					this.gameContext = this.gameCanvas.getContext("2d");
					this.gameContext.font = "12px Arial";
					var _this = this;
					window.addEventListener('resize', function () {
						_this.resize()
					}, false);
					window.addEventListener('orientationchange', function () {
						_this.resize()
					}, false);
					var _this = this;
					window.addEventListener('mousedown', function(e) {
						if(_this.hudCtl.displayBackgroundHud){
							return ;//A HUD IS UP SO FORGET THIS
						}
						var mouseStartPos = _this.getMousePos(e);
						//Find Tile

						//If tile has object on it move to then interact
						for (var i in WorldCache.world.objects) {
							if (WorldCache.world.objects[i]) {

								var object = WorldCache.world.objects[i];
								if (
									(object.x == _this.selected_tile.x) &&
									(object.y == _this.selected_tile.y) &&
									(!object.detached)
								) {
									_this.setSelectedObject(object);
									_this.hudCtl.show('target');
								}
							}
						}


					});
					window.addEventListener('mousemove', function(e) {

						var mouseStartPos = _this.getMousePos(e);

						_this.selected_tile = _this.getWorldPosFromScreenXY(mouseStartPos.x, mouseStartPos.y);

					});
					window.addEventListener('contextmenu', function(event) {

							event.preventDefault();


					});

				}
				_GameScreen.prototype.getMousePos = function(evt) {
					var rect = this.gameCanvas.getBoundingClientRect();
					return {
						x: evt.clientX - rect.left,
						y: evt.clientY - rect.top
					};
				}
				_GameScreen.prototype.startRendering = function(){
					if(this.timeout){
						return; //We are already rendering
					}
					this.setTimeout();
				}
				_GameScreen.prototype.setTimeout = function(){
					var _this = this;
					this.timeout = $timeout(function(){
						_this.render_world();
					}, 200);
				}
				_GameScreen.prototype.set_viewport_focus = function (object_id) {
					if (object_id.id) {
						object_id = object_id.id;
					}
					this.view_port_focus = object_id;
				}
				_GameScreen.prototype.set_viewport = function (x, y, z) {

					this.view_port.x = x;
					this.view_port.y = y;
					this.view_port.z = z;
				}
				_GameScreen.prototype.setSelectedObject = function(object){
					this.selected_object = object;
				}
				_GameScreen.prototype.getSelectedObject = function(object){
					return this.selected_object;
				}


				_GameScreen.prototype.getScreenPosFromWorldXY = function(x, y){
					var focus_object = WorldCache.world.objects[this.view_port_focus];
					var draw_x = (x - this.view_port.x) + this.view_radius / 2 + focus_object.x_offset;
					var draw_y = (y - this.view_port.y) + focus_object.y_offset;
					var screen_x = (draw_x * this.tile_width/2) - (this.tile_width * draw_y/2);
					var screen_y = (draw_y * this.tile_height/2) + (this.tile_height * draw_x/2);
					return {
						x:screen_x,
						y:screen_y
					}
				}
				_GameScreen.prototype.getWorldPosFromScreenXY = function(screen_x, screen_y){

					var pos = this.getScreenPosFromWorldXY(0,0)
					var xDiff = screen_x - pos.x;
					var yDiff = screen_y - pos.y;
					var x = Math.round((xDiff/ this.tile_width) -.5);

					var y = Math.round((yDiff/ this.tile_height) -.5);


					var y_offset = Math.floor((xDiff/ this.tile_width) -.5) ;
					var x_offset = Math.floor((yDiff/ this.tile_height) -.5);
					var world_y = (y - y_offset );
					var world_x = (x + x_offset);
					return {
						x:world_x,
						y:world_y
					}

				}
				_GameScreen.prototype.drawDebug = function(){

					/*this.gameContext.strokeStyle="#00FF00";

					var pos = this.getScreenPosFromWorldXY(0,0)

					this.gameContext.beginPath();
					this.gameContext.moveTo(pos.x, 0);
					this.gameContext.lineTo(pos.x, this.gameCanvas.height);
					this.gameContext.stroke();

					this.gameContext.beginPath();
					this.gameContext.moveTo(0, pos.y);
					this.gameContext.lineTo(this.gameCanvas.width, pos.y);
					this.gameContext.stroke();*/

				}
				_GameScreen.prototype.render_world = function () {
					//Clear canvas
					this.gameContext.clearRect(
						0,
						0,
						this.gameCanvas.width,
						this.gameCanvas.height
					);
					var world = WorldCache.world;
					var _this = this;


					//Update view port
					if (this.view_port_focus && world.objects[this.view_port_focus]) {
						var focus_object = world.objects[this.view_port_focus];
						this.set_viewport(
							focus_object.x,
							focus_object.y,
							focus_object.z
						)
					}


					for (var x = this.view_port.x - this.view_radius; x < this.view_port.x + this.view_radius; x++) {
						if (world.tiles[x]) {

							for (var y = this.view_port.y - this.view_radius; y < this.view_port.y + this.view_radius; y++) {
								if (world.tiles[x][y]) {

									var tile = world.tiles[x][y];

									var draw_x = (x - _this.view_port.x) + _this.view_radius / 2 + focus_object.x_offset;
									var draw_y = (y - _this.view_port.y) + focus_object.y_offset;



									if(
										!(
											(this.selected_tile.x == x) &&
											(this.selected_tile.y == y)
										)
									){

										_this.gameContext.drawImage(
											tile.image,
											(draw_x * _this.tile_width/2) - (_this.tile_width * draw_y/2),
											(draw_y * _this.tile_height/2) + (_this.tile_height * draw_x/2),
											_this.tile_width,
											_this.tile_height
										);




									}
									//Draw walls too
									if(tile.walls.left) {
										var pos = _this.getScreenPosFromWorldXY(x,y);
										_this.gameContext.drawImage(
											tile.walls.left.image,
											pos.x + _this.tile_width/2,
											pos.y + _this.tile_height/2 - tile.walls.left.height,
											_this.tile_width/2,
											tile.walls.left.height
										);
									}
								}
							}
						}
					}

					for (var i in world.objects) {
						if (world.objects[i]) {

							var object = world.objects[i];
							if (!object.detached) {

								var image = object.render();
								if(image){

									var draw_x = (object.x - _this.view_port.x) + _this.view_radius / 2 - (object.x_offset - focus_object.x_offset);
									var draw_y = (object.y - _this.view_port.y) - (object.y_offset  - focus_object.y_offset);


									var draw_pixel_x = (draw_x * _this.tile_width/2) - (_this.tile_width * draw_y/2);
									var draw_pixel_y = (draw_y * _this.tile_height/2) + (_this.tile_height * draw_x/2)- image.height;
									_this.gameContext.drawImage(
										image,
										draw_pixel_x,
										draw_pixel_y /*,
										_this.tile_width/2,
										_this.tile_width/2*/
									);

									//Figure out canvas mode
									//if mouse over display detail
									if(object.name){

										_this.gameContext.fillText(
											object.name,
											draw_pixel_x,
											draw_pixel_y - 20
										);
									}
								}

							}
						}
					}

					this.drawDebug();



					this.setTimeout();
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
					this.view_radius = Math.ceil((newHeight / this.tile_height)) + 5;
					/*this.view_radius = newHeight/this.tile_width;*/
				}
				_GameScreen.prototype.setHudCtl = function($scope){
					this.hudCtl = $scope;
				}
				var gameScreen = new _GameScreen();
				gameScreen.resize();
				return gameScreen;

			}
		]
	)

	.directive('shortcut', ['$document', '$rootScope', function ($document, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			link: function postLink(scope, iElement, iAttrs) {

				$document.bind('keypress', function (e) {
					//document.onkeypress = function (e) {
					var key = null;
					switch (e.which) {
						case(13):
							key = 'enter';
							break;
						default:
							key = String.fromCharCode(e.which);
					}
					$rootScope.$broadcast('keypress', e, key);
				});
			}
		};
	}])
	.factory('AnimationFactory', [
		function(){
			var _AnimationFactory = function(options){
				this._frame_ct = -1;
				//this.screen = options.screen;
				this.frames = options.frames;
				for(var i in this.frames){
					if(this.frames[i]){
						this.frames[i].image = new Image();
						this.frames[i].image.src = this.frames[i].data_url;
					}
				}
				return this;
			}
			/**
			 * Returns an image in data url form
			 */
			_AnimationFactory.prototype.render = function(){

				this._frame_ct += 1;
				if(this._frame_ct >= this.frames.length){
					this._frame_ct = 0;
				}
				var frame = this.frames[this._frame_ct];
				return frame.image;
			}
			return _AnimationFactory;
		}
	]);

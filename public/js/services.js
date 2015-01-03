 angular.module('wheezy')
	 .factory(
    'SpriteSheet',
    [
        function(){
			var _spriteSheet = function(options){
				this.img_src = options.img_src;
				this.tile_width = options.tile_width;
				this.tile_height = options.tile_height;
				return this;
			}
			_spriteSheet.prototype.getTile = function(x, y){

			}
			return _spriteSheet
		}
 	]
 ) .factory(
	 'Socket',
	 [
		 '$cookies',
		 '$cookieStore',
		 function($cookies, $cookieStore){
			 var socket = window.io();
			 socket.on('hello', function(data){

				 socket.emit('greet', { user: $cookieStore.user });
			 });
			 socket.on('create-user', function(data){

				 //Create cookie
				 $cookies.user = data.user;

			 });
			 socket.on('refresh-world', function(data){

					console.log("Init WOrld:" , data);

			 });
			 return socket;
		 }
	 ]
 ).factory(
		 'GameScreen',
		 [
			 function(){
				 var _GameScreen = function(options){
					this.gameArea = document.getElementById('gameArea');
					 if(!this.gameArea){
						 throw new Error("Game Area Element not found");
					 }
					this.gameCanvas = document.getElementById('gameCanvas');
					this.widthToHeight = 4 / 3;


					 window.addEventListener('resize', function(){ this.resize() }, false);
					 window.addEventListener('orientationchange', function(){ this.resize() }, false);
				 }
				 _GameScreen.prototype.render = function(){

				 }
				 _GameScreen.prototype.resize = function(){
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

				 return _GameScreen;

			 }
		 ]
	 )


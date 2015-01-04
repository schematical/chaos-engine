var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.User = function(options){
		this.sockets = [];
		this.setupUserInputs();
		_.extend(this, options);
		//console.log(this);
	}

	app.User.prototype.bindSocket = function(socket){
		socket.on('user-input', _.bind(this.handel_userInput, this));
		socket.on('disconnect', _.bind(this.handel_disconnect(this.sockets.length), this));
		this.sockets.push(socket);
	}
	app.User.prototype.broadcast = function(event, data){
		for(var i in this.sockets){
			this.sockets[i].emit(event, data);
		}
	}
	app.User.prototype.handel_userInput = function(data){
		//Event
		if(this.userInputEvents[data.action]){
			this.userInputEvents[data.action](data);
		}


		//Object

	}
	app.User.prototype.handel_disconnect = function(socket_index){
		return function(){
			//TODO: Splice that shit
		}
	}
	app.User.prototype.setupUserInputs = function(){
		var _userInputEvents = {
			'player.move.up': function(data){
				if(this.player_object.walk.up()){
					//Success
				}else{
					//Fail
				}
			},
			'player.move.down': function(data){
				if(this.player_object.walk.down()){
					//Success
				}else{
					//Fail
				}
			},
			'player.move.left': function(data){
				if(this.player_object.walk.left()){
					//Success
				}else{
					//Fail
				}
			},
			'player.move.right': function(data){
				if(this.player_object.walk.right()){
					//Success
				}else{
					//Fail
				}
			},
			'player.interact': function(data){
				//Determine the target based on which direction the player is facing
				this.player_object.interact(data);

			}

		};
		this.userInputEvents = {};
		for(var i in _userInputEvents){
			this.userInputEvents[i] = _.bind(_userInputEvents[i], this);
		}
	}
}
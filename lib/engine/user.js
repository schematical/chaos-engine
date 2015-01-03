var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.User = function(options){
		this.sockets = [];
		this.setupUserInputs();
		_.extend(this, options);
		//console.log(this);
	}
	app.User.prototype.setupUserInputs = function(){
		this.userInputEvents = {
			'player.move.up': _.bind(function(data){
				if(this.player_object.setXY(this.player_object.x, this.player_object.y  - 1)){
					//Success
				}else{
					//Fail
				}
			}, this)
		};
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
}
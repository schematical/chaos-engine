var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.User = function(options){
		this.sockets = [];
		_.extend(options, this);
	}
	app.User.prototype.bindSocket = function(socket){
		socket.on('user-input', _.bind(this.handel_userInput, this));
		socket.on('disconnect', _.bind(this.handel_disconnect(this.sockets.length), this));
		this.sockets.push(socket);
	}
	app.User.prototype.handel_userInput = function(data){
		//Event

		//Object

	}
	app.User.prototype.handel_disconnect = function(socket_index){
		return function(){
			//TODO: Splice that shit
		}
	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.Engine = function(options){
		this.users = {};

	}
	app.Engine.prototype.connect_user = function(socket){

		//console.log('a user connected');
		socket.emit('hello', { });


		socket.on('greet', _.bind(function(data){

			//this.users[]
			if(!data.user || !this.users[data.user]){
				//Create new User
				var new_user_id = 'user-' + Math.floor(Math.random() * 1000);

				this.users[new_user_id] = new app.User({
					id: new_user_id
				});
				socket.emit('create-user', { user: new_user_id });
			}

			this.users[data.user || new_user_id].bindSocket(socket);

		}, this));


	}
}
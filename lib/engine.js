
module.exports = function(app){
	app.Engine = function(options){
		this.users = {};

	}
	app.Engine.prototype.connect_user = function(socket){
		console.log('a user connected');
		socket.emit('hello', { })
		socket.on('disconnect', function(){
			console.log('user disconnected');
		});
		socket.on('greet', function(msg){
			console.log(msg);
			//this.users[]
		});


	}
}
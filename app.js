var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./lib')(app);
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/templates/index.html');
});

var game = new app.Game({});
io.on('connection', function(socket){ game.connect_user(socket) });



http.listen(3000, function(){
	console.log('listening on *:3000');
	setInterval(function(){
		//Cycle the world

	}, 100);
});
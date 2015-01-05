var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./lib')(app);
app.use(express.static(__dirname + '/public'));


var game = new app.Game({});
io.on('connection', function(socket){ game.connect_user(socket) });

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/templates/index.html');
});
app.get('/sprite_util', function(req, res){
	res.sendFile(__dirname + '/public/templates/sprite_util.html');
});
app.get('/world', function(req, res){
	res.send(JSON.stringify(game.world.toObject()));
});


http.listen(3000, function(){
	console.log('listening on *:3000');
	game.init();
});
var express = require('express');
var app = express();
var connect_multiparty = require('connect-multiparty');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app._root_dir = __dirname;
app.use(connect_multiparty());
require('./lib')(app);
app.use(express.static(__dirname + '/public'));


app.game = new app.Game({});
io.on('connection', function(socket){ app.game.connect_user(socket) });



http.listen(3000, function(){
	console.log('listening on *:3000');
	app.game.init();
});
var fs = require('fs');

module.exports = function(app){
	app.get('/', function(req, res){
		res.sendFile(app._root_dir + '/public/templates/index.html');
	});
	app.get('/sprite_util', function(req, res){
		res.sendFile(app._root_dir + '/public/templates/sprite_util.html');
	});
	app.post('/sprite_util', function(req, res){
		/*console.log('Images:', req.body, req.files.image);*/

		var file = fs.readFileSync(req.files.image.path);
		fs.writeFileSync(app._root_dir + '/public' + req.body.image_loc,file);
		return res.send("done");


	});
	app.get('/world', function(req, res){
		res.send(JSON.stringify(app.game.world.toObject()));
	});
	app.get('/world_test', function(req, res){
		app.Serilaizer.serialize_world(app.game.world, function(err, world_data){
			res.send(JSON.stringify(world_data));
		});
	});

}
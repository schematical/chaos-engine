var fs = require('fs');

module.exports = function(app){
	app.get('/', function(req, res){
		return res.sendFile(app._root_dir + '/public/templates/index.html');
	});
	app.get('/debug', function(req, res){
		return res.sendFile(app._root_dir + '/public/templates/debug.html');
	});
	app.get('/reset', function(req, res, next){
		app.game.reset(function(err){
			if(err) return next(err);
			return res.send("Reset Finished");
		});

	});
	app.get('/sprite_util', function(req, res){
		return res.sendFile(app._root_dir + '/public/templates/sprite_util.html');
	});
	app.post('/sprite_util', function(req, res){
		/*console.log('Images:', req.body, req.files.image);*/

		var file = fs.readFileSync(req.files.image.path);
		fs.writeFileSync(app._root_dir + '/public' + req.body.image_loc,file);
		return res.send("done");


	});
	app.get('/world', function(req, res){
		return res.send(JSON.stringify(app.game.world.toObject()));
	});
	app.get('/world_test', function(req, res){
		app.Serilaizer.serialize_world(app.game.world, function(err, world_data){
			return res.send(JSON.stringify(world_data));
		});
	});

}

module.exports = function(app){
	app.World = function(options){
		var world = new app.WorldBase(options);
		world.width = 100;
		world.height = 100;
		for(var x = 0; x < world.width; x++){
			if(!world.tiles[x]){
				world.tiles[x] = [];
			}
			for(var y = 0; y < world.height; y++){
				world.tiles[x][y] = new app.TileBase({
					id:'tile-' + x +'-' + y,
					type:'tile-1',// + /*((x * 20) + y),*/Math.floor(Math.random() * 20 * 20),
					x:x,
					y:y
				});
			}
		}


		return world;
	}
}

module.exports = function(app){
	 app.World = function(options){
		 this.tiles = [];
		 this.objects = [];
		 return this;
	 }
	app.World.prototype.cycle = function(){
		//Iterate through the whole world

	}
	app.World.prototype.cycle_npcs = function(){
		//Iterate through the whole world

	}
	app.World.prototype.view_tiles = function(x, y, range){
		if(!range){
			range = 5
		}
		var response = {};
		for(var xi  = x - range; xi < x + range; xi++){
			for(var yi  = y - range; yi < y + range; yi++){
				if(this.tiles[xi] = this.tiles[xi][yi]){
					if(!response[xi]){
						response[xi] = {};
					}
					response[xi][yi] = this.tiles[xi][yi];
				}
			}
		}
		return response;
	}
}
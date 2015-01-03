
module.exports = function(app){
	 app.WorldBase = function(options){
		 this.tiles = [];
		 this.objects = [];
		 return this;
	 }
	app.WorldBase.prototype.cycle = function(){
		//Iterate through the whole world

	}
	app.WorldBase.prototype.cycle_npcs = function(){
		//Iterate through the whole world

	}

	app.WorldBase.prototype.addObject = function(object, x, y){
		if(!this.id){
			throw new Error("Invalid object, need to have an id");
		}
		this.objects[object.id] = object;
	}
	app.WorldBase.prototype.view_tiles = function(x, y, range){
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
	app.WorldBase.prototype.toObject = function(){
		var ret = {};
		ret.tiles = {};
		for(var x in this.tiles){
			ret.tiles[x] = {};
			for(var y in this.tiles[x]){

				if(/*this.tiles[x][y] && */this.tiles[x][y].toObject){
					ret.tiles[x][y] = this.tiles[x][y].toObject();
				}
			}
		}
		return ret;
	}
}
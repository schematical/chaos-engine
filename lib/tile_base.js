
module.exports = function(app){
	app.TileBase = function(options){

		var tile = app.ObjectBase(options);
		tile.objects = {};
		tile.addObject = function(object){
			if(!object || object instanceof app.ObjectBase){
				throw new Error("Invalid object to add to this tile");
			}
			if(this.objects[object.id]){
				console.log("Tile: " + this.id + '  already has object(' + object.id + '). Why are you trying to add it?');
			}
			var event = {
				object:object,
				from_tile:object.tile,
				to_tile:this
			}
			if(object.tile){
				object.tile.trigger('object.leave', event);
			}
			this.trigger('object.enter', event);
			this.object('object.change-tile', event);
			this.objects[object.id] = object;
		}
		/*tile.removeObject = function(object_id){
			if(object_id.id){
				object_id = object_id.id;
			}
			if(tile.objects[object_id]){
				delete(tile.objects[object_id]);
			}else{
				console.log("Tile: " + this.id + '  does not have object(' + object_id + '). Why are you trying to remove it?');
			}
		}*/
		return tile;
	}
}
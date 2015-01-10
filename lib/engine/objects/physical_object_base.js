
module.exports = function(app){
	app.PhysicalObjectBase = function(options){
		var object = new app.ObjectBase(options);
		object.is_blocking = function(){
			return object._is_blocking;
		}
		object.is_detached = function(){
			return object._is_detached;
		}
		object.detach = function(){
			if(this.is_detached()){
				throw new Error("Object " + object.id + " is already detached");
			}

			var tile = this.world.getTile(this.x, this.y);

			tile.trigger('object.leave', { object: this });
			this._is_detached = true;
			this.x = null;
			this.y = null;

		}
		object.world.addObject(object, 0, 0);
		return object
	}
}

module.exports = function(app){
	app.PhysicalObjectBase = function(options){
		var object = new app.ObjectBase(options);
		object.is_blocking = function(){
			return object._is_blocking;
		}
		object.world.addObject(object, 0, 0);
		return object
	}
}
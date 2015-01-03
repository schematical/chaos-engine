
module.exports = function(app){
	app.PhysicalObjectBase = function(options){
		var object = app.ObjectBase(options);
		object.world.addObject(object, 0, 0);
		return object
	}
}
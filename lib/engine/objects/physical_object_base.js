"use strict";
module.exports = function(app){
	app.PhysicalObjectBase = class PhysicalObjectBase extends app.ObjectBase{
		constructor(options) {
			this.on('serialize',function(event, data, cb){
				data._is_blocking = this._is_blocking;
				data._is_detached = this._is_detached;
				return cb();


			});
			this.on('unserialize',function(event, data, cb){
				this._is_blocking = data._is_blocking;
				this._is_detached = data._is_detached;

				return cb();

			});
			this.world.addObject(this, 0, 0)
		}
		is_blocking(){
			return this._is_blocking;
		}
		is_detached(){
			return this._is_detached;
		}
		detach(){
			if(this.is_detached()){
				throw new Error("Object " + object.id + " is already detached");
			}

			var tile = this.world.getTile(this.x, this.y);

			tile.trigger('object.leave', { object: this });
			this._is_detached = true;
			this.x = null;
			this.y = null;

		}

	}
}
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	app.objects = {};
	app.ObjectBase = function(options){
		this.id = null;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.xv = 0;
		this.yv = 0;
		this.zv = 0;
		this.tile = null;
		this.type = null;
		this.state = null;
		this.events = {};

		_.extend(options, this);
		//Parent Tile
		if(!this.id){
			throw new Error("Invalid object, need to have an id");
		}
		app.objects[this.id] = this;

		return this;
	}
	app.ObjectBase.prototype.setTile = function(tile){
		//Notify old tile of removial of object
	}
	app.ObjectBase.prototype.on = function(event, callback){
		if(!this.events[event]){
			this.events[event] = [];
		}
		this.events[event].push(_.bind(this, callback));
	}
	app.ObjectBase.prototype.trigger = function(event, data, next){
		if(this.events[event]){
			async.eachSeries(
				this.events[event],
			    function(callback, cb){
					return callback(event, data, cb);
			    },
			    function(errs){
					if(next){
						return next();
					}
			    }
			)
		}
	}
	app.ObjectBase.prototype.destroy = function(data){
		var event = {
			data:data,
			object:this,
			tile:this.tile
		}
		if(this.tile){
			this.tile.trigger('object.destroy', event);
		}
		this.trigger('object.destroy', event);
		if(!app.objects[this.id]){
			return console.error("Object already destroyed? Cant find it in the app.objects collection");
		}
		delete(app.objects[this.id]);
	}

}
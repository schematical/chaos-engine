var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	app.ObjectBase = function(options){
		this.world = null;
		this.id = null;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.xv = 0;
		this.yv = 0;
		this.zv = 0;
		this.rotation = 0;
		this.tile = null;
		this.type = null;
		this.state = 'default';
		this.events = {};
		this._updated = true;

		_.extend(this, options);
		//Parent Tile

		this.on('serialize',function(event, data, cb){

			data.id = this.id;
			data.x = this.x;
			data.y = this.y;
			data.z = this.z;
			data.xv = this.xv;
			data.yv = this.yv;
			data.zv = this.zv;
			data.rotation = this.rotation;
			data.title = this.tile;
			data.type = this.type;
			data.state = this.state;
			return cb();


		});
		this.on('unserialize',function(event, data, cb){
			this.id = data.id;
			this.x = data.x;
			this.y = data.y;
			this.z = data.z;
			this.xv = data.xv;
			this.yv = data.yv;
			this.zv = data.zv;
			this.rotation = data.rotation;
			this.title = data.tile;
			this.type = data.type;
			this.state = data.state;
			return cb();
		});

		return this;
	}
	app.ObjectBase.prototype.markUpdated = function(){
		this._updated = true;
	}
	app.ObjectBase.prototype.markFresh = function(){
		this._updated = false;
	}
	app.ObjectBase.prototype.isUpdated = function(){
		return this._updated;
	}
	app.ObjectBase.prototype.setTile = function(tile){
		//Notify old tile of removial of object
	}
	app.ObjectBase.prototype.setXY = function(x, y){
		var tile = this.world.getTile(x, y);
		if(!tile){
			return false;
		}

		this.x = tile.x;
		this.y = tile.y;
		tile.addObject(this);
		this.markUpdated();
		return true;
	}
	app.ObjectBase.prototype.on = function(event, callback){
		if(!this.events[event]){
			this.events[event] = [];
		}
		this.events[event].push(_.bind(callback, this));
	}
	app.ObjectBase.prototype.trigger = function(event, data, next){
		//console.log('Triggering:' + event);
		if(!this.events[event]){
			if(next){
				return next();
			}
			return;
		}
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
	app.ObjectBase.prototype.toObject = function(){
		var ret = {
			id:this.id,
			type:this.type,
			name: this.name,
			race: this.race,
			gender: this.gender,
			z:this.z,
			x:this.x,
			y:this.y,
			age:this.age,
			rotation:this.rotation,
			facing:this.facing || 'down',
			state: this.state,
			detached: this._is_detached || false
		}
		return ret;
	}

}
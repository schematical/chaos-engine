"use strict";
const async = require('async');
const _ = require('underscore');

module.exports = function(app){
	app.TileBase = class TileBase {
		constructor(options) {

			var tile = new app.ObjectBase(options);
			tile.objects = {};
			tile.walls = {};
			tile.addObject = function (object) {
				if (!object || !(object instanceof app.ObjectBase)) {
					throw new Error("Invalid object to add to this tile");
				}
				if (this.objects[object.id]) {
					console.log("Tile: " + this.id + '  already has object(' + object.id + '). Why are you trying to add it?');
				}
				var event = {
					object: object,
					from_tile: object.tile,
					to_tile: this
				}
				if (object.tile) {
					object.tile.trigger('object.leave', event);
				}
				this.trigger('object.enter', event);
				this.trigger('object.change-tile', event);
				this.objects[object.id] = object;
				object.tile = this;
			}
			tile.addWallTopLeft = function (wall) {
				if (_.isString(wall)) {
					wall = {type: wall};
				}
				this.walls.left = wall;
			}
			tile.on('object.leave', function (event, data, next) {

				if (this.objects[data.object.id]) {
					delete(this.objects[data.object.id]);
				} else {
					/*console.error*/
					throw new Error(data.object.id + ": Not on tile so how are you leaving?");
				}
				return next();

			});
			tile.on('interact', function (event, data, next) {

				async.eachSeries(
					Object.keys(tile.objects),
					function (key, cb) {
						return tile.objects[key].trigger(event, data, cb)
					},
					function (errs) {
						return next();
					}
				)
			})

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
			var _toObject = _.bind(tile.toObject, tile);
			tile.toObject = function () {
				var ret = _toObject();
				ret.walls = this.walls;
				return ret;
			}

			return tile;
		}
	}
}
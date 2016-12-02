"use strict";
const _ = require('underscore');
module.exports = function(app){
	app.InventoryObjectBase = class InventoryObjectBase extends app.PhysicalObjectBase{
		constructor(options) {
			var default_options = {
				weight: 1,
				equappable_slots: [],
				_is_inventory_object: true,
				on_ingest: function (npc, data, next) {
					//Most things are not meant to be ingested so cause damage by default
					npc.health -= 50;
					return next();
				},
				on_equip: function (npc, data, next) {
					return next();
				},
				on_use_attack: function (npc, data, next) {
					if (!data.target) {
						return next();
					}
					//Do nothing actually, most items wont hurt some one
					return next();
				}
			}
			_.extend(default_options, options);

			super(default_options);

			this.on('interact',  (event, data, next)=> {

				//Add yourself to player inventory
				data.npc.add_to_inventory(this);

				//Remove from world
				try {
					this.detach();
				} catch (e) {
					return next(e);
				}
				this.markUpdated();
				return next();
			});
			this.on('serialize',function(event, data, cb){
				data.container = null;
				return cb();
			});
		}
		ingest(npc, data, next){
			if(!this.container){
				throw new Error("An item cannot be ingested unless it is in an NPC's inventory and the NPC is the item's container")
			}
			this.container.remove_from_inventory(this);
			if(!this.on_ingest){
				return next(new Error('Object "' + this.id + '" has no method "on_ingest"'));
			}
			return this.on_ingest(npc, data, function(err){
				if(err) return next(err);

				data.object.destroy();
				return next();
			});
		}
		get container(){
			return this._container;
		}
		set container(val){
			console.log('InventoryObjectBase: Setting ' + this.id + ' = ' + val && val.id  || null);
			if(val && (this._container && this._container.id != val.id)){
				throw new Error("InventoryObjectBase(" + this.id + ") already has a container NPC(" + this._container.id + "), cannot set to NPC(" + this._container.id +")");
			}
			return this._container = val;
		}
		equip(npc, data, next){
			return this.on_equip(npc, data, next);
		}
		use_attack(npc, data, next){
			return this.on_use_attack(npc, data, next);
		}
	}
}
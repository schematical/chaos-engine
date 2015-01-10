inventory_object_base.on('interact', function(event, data, next){

	//Add yourself to player inventory
	data.npc.add_to_inventory(this);
	//Remove from world
	this.detach();
	this.markUpdated();
});
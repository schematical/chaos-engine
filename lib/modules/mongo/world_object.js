
module.exports = function(app){
	app.schema.WorldObject = app.Mongoose.model(
		'WorldObject',
		{
			_id:app.Mongoose.schema.ObjectId,
			name: String,
			object_id:String,
			type:{ type:'string'},
			_is_npc:{ type:'boolean'},
			x:{ type:'number'},
			y:{ type:'number'},
			z:{ type:'number'},
			serialized:{ type: 'object' }
		}
	);

}
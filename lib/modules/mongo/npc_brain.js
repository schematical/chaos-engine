
module.exports = function(app){
	app.schema.WorldObject = app.Mongoose.model(
		'NPCBrain',
		{
			_id:app.Mongoose.schema.ObjectId,
			name: String,
			object_id:String,
			x:{ type:'number'},
			y:{ type:'number'},
			z:{ type:'number'},
			serialized:{ type: 'object' }
		}
	);

}
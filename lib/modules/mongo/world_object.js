
module.exports = function(app){
	var _WorldObject = new app.Mongoose.Schema(

		{
			_id:app.Mongoose.Schema.ObjectId,
			name: String,
			object_id:String,
			type:{ type:'string'},
			_is_npc:{ type:'boolean'},
			x:{ type:'number'},
			y:{ type:'number'},
			z:{ type:'number'},
			world:{ type: app.Mongoose.Schema.Types.ObjectId, ref: 'World'  },
			serialized:{ type: 'string' }
		}
	);
	_WorldObject.pre('save', function(next){
		if(!this._id){
			this._id = new app.Mongoose.Types.ObjectId();

		}
		return next();
	});
	app.schema.WorldObject = app.Mongoose.model('WorldObject', _WorldObject);

}
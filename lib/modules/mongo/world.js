
module.exports = function(app){
	var _World = new app.Mongoose.Schema(
		{
			_id:app.Mongoose.Schema.ObjectId,
			global_x:{ type: 'number'},
			global_y:{ type: 'number'},
			name: String,
			tiles:Object
		}
	);
	_World.pre('save', function(next){
		if(!this._id){
			this._id = new app.Mongoose.Types.ObjectId();

		}
		return next();
	});
	app.schema.World = app.Mongoose.model('World', _World);

}
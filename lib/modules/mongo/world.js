
module.exports = function(app){
	app.schema.World = app.Mongoose.model(
		'World',
		{
			_id:app.Mongoose.schema.ObjectId,
			name: String,
			tiles:Object
		}
	);

}
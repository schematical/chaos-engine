
module.exports = function(app){
 	app.Game = function(options){
		var game = new app.Engine(options);


		return game;
	}
}
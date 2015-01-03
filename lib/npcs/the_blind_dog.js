
module.exports = function(app){
	app.TheBlindDog = function(options){
		return new app.NPCBase(options);
	}
}

module.exports = function(app){
	app.TheBlindDog = function(options){
		options.type = 'the_blind_dog';
		return new app.NPCBase(options);
	}
}
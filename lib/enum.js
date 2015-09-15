
module.exports = function(app){
	app.LogicFactory.regester_value('interaction.type', 'mate');
	app.LogicFactory.regester_value('interaction.type', 'steal');

	app.LogicFactory.regester_value('smell', 'food');
	app.LogicFactory.regester_value('smell', 'gun_powder');


	app.LogicFactory.regester_value('race', 'human');
	app.LogicFactory.regester_value('race', 'dog');
	app.LogicFactory.regester_value('race', 'rat');

}
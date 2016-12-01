
module.exports = function(app){
	app.logic.inputs.DefaultBehavior = class DefaultBehavior  extends app.InputNodeBase{
		constructor(options){
			options.type = 'DefaultBehavior';
			super(options);
			//Get close tiles
		}
		condition(data, cb){
			//If NPC already has an output node for now then get out
			if(this.npc._actingOutputNode){
				return cb();
			}
			return this.trigger(
				{
					target:this
				},
				cb
			);



		}
	}
}
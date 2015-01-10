
module.exports = function(app){
	app.LogicFactory = {
		populate_npc:function(npc, next){

		},
		/*
		THE FOLLOWING IS QUICK TRAINING STUFF.
		 */
		/**
		 * Basic survival
		 * @param npc
		 * @param next
		 */
		survival_101:function(npc, next){
			//Find food
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});
			var interact = new app.logic.outputs.Interact({
				npc:npc
			});
			follow.success_node(interact);
			var smell_follow_food = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.ObjectTarget({
					type:['food-bacon', 'food-fruit']
				})
			});
			smell_follow_food.outputNode(follow);
			npc.addLogicNode(smell_follow_food);
		},
		/**
		 * I am tempted to call this pig factory
		 * @param npc
		 * @param next
		 */
		police_training:function(npc, next){

		}
	}
}
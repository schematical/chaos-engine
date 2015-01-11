
module.exports = function(app){
	app.LogicFactory = {
		populate_npc:function(npc, next){

		},
		/**
		 * This takes an input node, splits it apart and randomly adds more links to the chain, both outputs and inputs
		 */
		mutate_nodes:function(inputNode){

		},
		/*
		THE FOLLOWING IS QUICK TRAINING STUFF.
		 */
		/**
		 * Basic survival
		 * @param npc
		 * @param next
		 */
		survival_101:function(npc){//, next){
			var all_food = ['food-bacon', 'food-fruit'];
	/*

			//If food is in my inventory eat it
			var ingest = new app.logic.outputs.IngestInventoryObject({
				npc:npc
			});
			var has_food_ingest = new app.logic.inputs.HasInInventory({
				npc:npc,
				target: new app.ObjectTarget({
					type:all_food
				})
			});
			has_food_ingest.outputNode(ingest);
			npc.addLogicNode(has_food_ingest);
*/


			//Find Mate
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});
			var interact = new app.logic.outputs.Interact({
				npc:npc,
				interaction_type:'mate'
			});
			follow.success_node(interact);
			var smell_follow_mate = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.NPCTarget({
					gender:((npc.gender == 'f')?'m':'f'),
					race:npc.race
				})
			});
			smell_follow_mate.outputNode(follow);
			npc.addLogicNode(smell_follow_mate);





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
					type:all_food
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
		police_training:function(npc){//, next){

		},
		/**
		 * I am tempted to call this pig factory
		 * @param npc
		 * @param next
		 */
		carnivore:function(npc){//, next){
			//Find food
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});
			var attack = new app.logic.outputs.Attack({
				npc:npc
			});
			follow.success_node(attack);
			var smell_follow_attack = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.NPCTarget({
					race:'rat',
					is_dead:false
				})
			});
			smell_follow_attack.outputNode(follow);
			npc.addLogicNode(smell_follow_attack);


		}
	}
}
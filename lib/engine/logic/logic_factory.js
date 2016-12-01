"use strict";
const async = require('async');
const _ = require('underscore');
module.exports = function(app){
	app.LogicFactory = {
		_value_regestery:{},
		regester_value:function(value_type, value){
			if(!app.LogicFactory._value_regestery[value_type]){
				app.LogicFactory._value_regestery[value_type] = { values: [] };
			}
			app.LogicFactory._value_regestery[value_type].values.push(value);
		},
		random_value:function(value_type){
			if(!app.LogicFactory._value_regestery[value_type]){
				throw new Error("No value type '" + value_type + "' registered in LogicFactory._value_regerstry. Use LogicFactory.regester_value() to register it.");
			}
			if(app.LogicFactory._value_regestery[value_type].values){
				var val_index = Math.floor(Math.random()  * app.LogicFactory._value_regestery[value_type].values.length);
				return app.LogicFactory._value_regestery[value_type].values[val_index];
			}
		},
		/**
		 * Should generate a random target to perform an action uppon
		 * @param options
		 * @returns {ObjectTarget}
		 */
		random_target:function(options){
			if(!options){
				options = {};
			}

			if(true){//TODO: Math.random stuff
				options.type = [app.LogicFactory.random_value('inventory-object.type')];
			}

			return new app.ObjectTarget(options);

		},
		populate_npc:function(npc, next){

		},
		/**
		 * This takes an input node, splits it apart and randomly adds more links to the chain, both outputs and inputs
		 */
		mutate_nodes:function(inputNode){
			//We need to know the potential decisions
			var inputs = Object.keys(app.logic.inputs);
			var outputs = Object.keys(app.logic.outputs);
			Math.floor(Math.random() * inputs.length);
			Math.floor(Math.random() * outputs.length);
		},
		add_random_node_chain:function(options){
			var default_options = {
				max_length:4,
				min_length:2,
				npc:null
			}
			options = _.extend(default_options, options);
			if(!options.npc || !options.npc._is_npc){
				throw new Error("Invalid NPC Passed in");
			}
			var chain_length = Math.floor(Math.random() * (options.max_length - options.min_length)) + options.min_length;
			var started_output = false;
			//We need to know the potential decisions
			var inputs = Object.keys(app.logic.inputs);
			var outputs = Object.keys(app.logic.outputs);
			var node_index = 0;
			var last_node = null;
			var failsafe = 0;

			var log = '';
			while(node_index < chain_length){
				if(!started_output){
					var node_key = inputs[Math.floor(Math.random() * inputs.length)];
					var node = new app.logic.inputs[node_key]({
						npc:options.npc,
						_randomize:true
					});
					if(last_node){
						last_node.chainInput(node);
					}else{
						options.npc.addLogicNode(node);
					}

				}else{
					var node_key = outputs[Math.floor(Math.random() * outputs.length)];
					var node = new app.logic.outputs[node_key]({
						npc:options.npc,
						_randomize:true
					});
					if(last_node.outputNode){
						//The last node was ain input node
						last_node.outputNode(node);
					}else{
						//The last node was an output node
						if(Math.random() > .1){//.5){
							last_node.success_node(node);
						}else{
							last_node.fail_node(node);
						}
					}
				}
				node_index += 1;
				last_node = node;
				//chance of turning to output
				if(!started_output){
					var output_odds = (chain_length - 1) - node_index;
					if(output_odds <= 0){
						started_output = true;
					}else if(Math.random() * (chain_length - 1) > output_odds){
						started_output = true;

					}
				}






				failsafe += 1;
				if(failsafe > 10){
					throw new Error("Failsafe hit")
				}
				log += last_node.toString();
			}

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

			var stat_change = new app.logic.inputs.StatChange({
				npc:npc,
				watch:'nourishment',
				tipping_point: npc.biology.nourishment_capacity * .50,
				compairison:'<'

			});
			has_food_ingest.outputNode(ingest);

			stat_change.chainInput(has_food_ingest);
			npc.addLogicNode(has_food_ingest);










			//Find Mate
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});
			var interact = new app.logic.outputs.Interact({
				npc:npc,
				interaction_type:'mate'
			});
			follow.success_node(interact);
			var explore = new app.logic.outputs.Explore({
				npc:npc
			});
			follow.fail_node(explore);
			var stat_change_age = new app.logic.inputs.StatChange({
				npc:npc,
				watch:'age',
				tipping_point: npc.biology.reproduction_age,
				compairison:'>'

			});
			var stat_change_food = new app.logic.inputs.StatChange({
				npc:npc,
				watch:'nourishment',
				tipping_point: npc.biology.nourishment_capacity * .50,
				compairison:'>'

			});
			var smell_follow_mate = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.ObjectTarget({
					gender:((npc.gender == 'f')?'m':'f'),
					race:npc.race,
					is_dead:false,
					age:{ compairison:'>', value: npc.biology.reproduction_age }
				})
			});

			smell_follow_mate.outputNode(follow);
			stat_change_food.chainInput(smell_follow_mate);
			stat_change_age.chainInput(stat_change_food);
			npc.addLogicNode(stat_change_age);





		},
		/**
		 * I am tempted to call this pig factory
		 * @param npc
		 * @param next
		 */
		police_training:function(npc){//, next){

		},
		/**
		 * Teaches carnivores how to eat
		 * @param npc
		 * @param next
		 */
		carnivore:function(npc){//, next){


			/**
			 * If you smell food on an dead animal eat it
			 * @type {.logic.outputs.Follow}
			 */
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});

			var steal = new app.logic.outputs.Interact({
				npc:npc,
				interaction_type:'steal'
			});
			follow.success_node(steal);
			var explore = new app.logic.outputs.Explore({
				npc:npc
			});
			follow.fail_node(explore);
			var smell_follow_steal = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.ObjectTarget({
					race:'rat',
					is_dead:true,
					_has_stuff_in_invetory:true
					//TODO: Add better filter. Dog Meat keeps dieing because he gets hungup on this interaction
				})
			});
			smell_follow_steal.outputNode(follow);
			npc.addLogicNode(smell_follow_steal);




			//Find prey
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});
			var attack = new app.logic.outputs.Attack({
				npc:npc
			});
			follow.success_node(attack);
			follow.fail_node(explore);
			var smell_follow_attack = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.ObjectTarget({
					race:'rat',
					is_dead:false
				})
			});
			smell_follow_attack.outputNode(follow);
			npc.addLogicNode(smell_follow_attack);




		},
		herbavore:function(npc){
			var vegies = ['food-bacon', 'food-fruit'];

			//Find food
			var follow = new app.logic.outputs.Follow({
				npc:npc
			});
			var interact = new app.logic.outputs.Interact({
				npc:npc
			});
			follow.success_node(interact);
			var explore = new app.logic.outputs.Explore({
				npc:npc
			});
			follow.fail_node(explore);


			var smell_follow_food = new app.logic.inputs.Smell({
				npc:npc,
				range:10,
				target: new app.ObjectTarget({
					type:vegies
				})
			});

			smell_follow_food.outputNode(follow);

			npc.addLogicNode(smell_follow_food);
		}
	}
}

module.exports = function(app){
	app.BiologyFactory = {
		spawn:function(child_npc, options){
			if(options.father){

			}
			if(options.mother){

			}
			//Spawn base stats
			/*
			memory_length:0,
			max_health:100,
			pleasure_matrix:{

			}
			*/
			if(options.basic_survival){
				child_npc.biology.push({
					stat:'nourishment',
					direction:'+'
				})
				child_npc.biology.push({
					stat:'health',
					direction:'+'
				})
			}


		}
	}
}

module.exports = function(app){
	app.logic.inputs.OnInteract = class OnInteract extends app.InputNodeBase{
		constructor(options) {
			options.type = 'OnInteract';
			super(options);
			//This is irrelevant
			//This is important
			this.npc.on('interact', (event, data, cb)=>{
				if(this.target && !this.target.match(data.target)){
					return cb();//The target does not match
				}
				data.target = this.target;
				console.log("Target:", data.target );
				this.trigger(data, cb)
			})
		}


		condition(data, cb){
			return cb();
		}
	}
}
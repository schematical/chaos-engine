angular.module('chaos_engine')
.controller('HudCtl', ['$scope','GameScreen',
		function($scope, GameScreen){

			$scope.reset = function(){
				$scope.displayDebugHud = false;
				$scope.displayIndentoryHud = false;
				$scope.displayTargetHud = false;

				$scope.displayBackgroundHud = false;
			}
			$scope.show = function(panel){
				//Hide other panels
				$scope.reset();
				$scope.$broadcast('panel_change', {
					panel:panel
				})
				switch(panel){
					case('debug'):
						$scope.displayDebugHud = true;
					break;
					case('inventory'):
						$scope.displayIndentoryHud = true;
					break;
					case('target'):
						$scope.displayTargetHud = true;
					break;
				}
				$scope.displayBackgroundHud = true;
			}


			//Kick it off
			$scope.displayBottomHud = true;
			$scope.reset();
			GameScreen.setHudCtl($scope);
		}
])
/** -----------------------------------

 DEBUG CONTROLLER

 ---------------------------------*/
	.controller('DebugController', [
		'$document',
		'$scope',
		'$cookies',
		'ngTableParams',
		'WorldCache',
		'GameScreen',
		function($document,$scope, $cookies,ngTableParams, WorldCache, GameScreen){
			WorldCache.on('update', function(world){

				var collection = [];
				for(var i in world.objects){
					collection.push(world.objects[i]);
				}
				$scope.collection = collection;
				$scope.displayDebugTargetList = true;
				$scope.selectInstance = function($event, instance){
					GameScreen.setSelectedObject(instance);
					$scope.$parent.show('target');
				}
				/*	$scope.tableParams = new ngTableParams(
				 {
				 page: 1,            // show first page
				 count: 10           // count per page
				 },
				 {
				 total: world.objects.length, // length of data
				 getData: function ($defer, params) {
				 var keys = Object.keys(world.objects).slice((params.page() - 1) * params.count(), params.page() * params.count());
				 var objects
				 $defer.resolve(

				 );
				 }
				 }
				 );*/
			})


		}
	]
)



/** -----------------------------------

 DEBUG CONTROLLER

 ---------------------------------*/
	.controller('TargetController', [
		'$document',
		'$scope',
		'$cookies',
		'WorldCache',
		'GameScreen',
		function($document,$scope, $cookies, WorldCache, GameScreen){


			$scope.$on('panel_change', function(data){
				$scope.showTarget('detail');
			});
			WorldCache.on('update', function(world){
				if(GameScreen.selected_object) {
					$scope.target = GameScreen.selected_object
				}
			});
			$scope.showTarget = function(screen){
				$scope.reset();
				switch(screen){
					case('detail'):
						$scope.displayTargetDetail = true;
					break;
					case('history'):
						$scope.displayTargetHistory = true;
						WorldCache.on('update', function(world) {
							$scope.history = $scope.target.object.history;//[];
						/*	for (var i in $scope.target.object.inventory) {
								var object = $scope.target.object.inventory[i];
								$scope.inventory.push(object);
							}*/
						});
						break;
					case('inventory'):
						$scope.displayTargetInventory = true;
						WorldCache.on('update', function(world) {
							$scope.inventory = [];
							for (var i in $scope.target.object.inventory) {
								var object = $scope.target.object.inventory[i];
								$scope.inventory.push(object);
							}
						});
					break;
					case('brain'):
						$scope.displayTargetBrain = true;
						//We also have to prepair the logic matrix
						WorldCache.on('update', function(world) {
							$scope.decision_matrix = [];
							for (var i in $scope.target.object.brain.decision_matrix) {
								var clean_node_chain = [];
								var node_chain = $scope.target.object.brain.decision_matrix[i];
								var finished = false;
								var safe = 0;
								while (!finished && (safe < 5)) {
									var node = {
										type: node_chain.type,
										exicuting: node_chain.exicuting
									};

									switch (node_chain.type) {
										case('StatChange'):
											node.target = node_chain.watch + node_chain.compairison + node_chain.tipping_point;
											break;
										case('Evade'):
											node.target = node_chain.distance;
											break;
										case('Interact'):
											node.target = node_chain.interaction_type;
											break;
										case('Explore'):
											node.target = 'direction_duration_max: ' + node_chain.direction_duration_max;
											break;
										default:
											node.target = JSON.stringify(node_chain.target)
											break;
									}


									clean_node_chain.push(node);
									if (node_chain._outputNode) {
										node_chain = node_chain._outputNode;

									} else if (node_chain._chainedInputNode) {
										node_chain = node_chain._chainedInputNode;
									} else if (node_chain._success_node) {
										node_chain = node_chain._success_node;
									} else if (node_chain._fail_node) {
										node_chain = node_chain._fail_node;
									} else {
										finished = true;
									}
									safe += 1;
								}

								$scope.decision_matrix.push(clean_node_chain);
							}
						});
					break;
				}
			}
			$scope.reset = function(){
				$scope.displayTargetDetail = false;
				$scope.displayTargetBrain = false;
				$scope.displayTargetInventory = false;
				$scope.displayTargetHistory = false;
			}
			$scope.showTarget('detail');
		}
	]
);




/*


.service('InventoryModal', ['ObjectCache', function (ObjectCache) {
	var _InventoryModal = function (data) {
		this.ingest = data.ingest;
		this.selected = null;
	}
	_InventoryModal.prototype.render = function () {
		var screen = this.screen;
		screen.gameContext.fillStyle = "#000000";
		var modal_width = this.screen.gameCanvas.width / 2;
		var modal_height = this.screen.gameCanvas.height / 2;
		screen.gameContext.fillRect(
			screen.gameCanvas.width / 4,
			screen.gameCanvas.height / 4,
			modal_width,
			modal_height
		);
		var object = this.world.objects[screen.view_port_focus];
		ObjectCache.loadImage(object.type, object.state, function (err, image) {

			screen.gameContext.drawImage(
				image,
				modal_width / 2 + (modal_width * .1),
				modal_height / 2 + (modal_height * .1),
				screen.tile_width,
				screen.tile_width
			);
		});
		var ct = 0;
		for (var i in object.inventory) {
			var screen_x = modal_width / 2 + (modal_width * .9) - screen.tile_width;
			var screen_y = modal_height / 2 + (modal_height * .1) + (screen.tile_width * 1.5 * ct);
			if (ct == this.selected) {
				screen.gameContext.fillStyle = "#ff0000";
				screen.gameContext.fillRect(
					screen_x - 5,
					screen_y - 5,
					screen.tile_width + 10,
					screen.tile_width + 10
				);
			}
			ObjectCache.loadImage(object.inventory[i].type, object.inventory[i].state, function (err, image) {

				screen.gameContext.drawImage(
					image,
					screen_x,
					screen_y,
					screen.tile_width,
					screen.tile_width
				);
			});
			ct += 1;
		}

	}
	_InventoryModal.prototype.apply = function (key) {

		var object = this.world.objects[this.screen.view_port_focus];
		switch (key) {
			case('w'):
				if (!this.selected) {
					this.selected = 0;
				} else {
					this.selected += 1;
				}
				if (this.selected > object.inventory.length) {
					this.selected = 0;
				}
				break;
			case('d'):
				if (!this.selected) {
					this.selected = 0;
				} else {
					this.selected -= 1;
				}
				if (this.selected < 0) {
					this.selected = object.inventory.length;
				}
				break;
			case('enter'):
				var inventory_object = object.inventory[this.selected];
				this.ingest(inventory_object);
				break;
			case('i'):
				this.screen.hideModal();
				break;
		}
	}
	return _InventoryModal;
}])*/

angular.module('sprite_util')
.controller('SpriteUtilController', [
		'$scope',
		function($scope){
			$scope.spriteCanvas = document.getElementById('sprite_canvas');

			$scope.spriteContext = $scope.spriteCanvas.getContext("2d");

			$scope.spriteCanvas.addEventListener('mousedown', function(evt) {
				var mousePos = $scope.getMousePos($scope.spriteCanvas, evt);
				var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
				//console.log(message);
				var pixel_data = $scope.spriteContext.getImageData(mousePos.x, mousePos.y, 1, 1);
				$scope.selected_color = pixel_data;
			}, false);

			$scope.selector_width = 75;
			$scope.selector_height = 38;
			$scope.selector_x = 0;
			$scope.selector_y = 0;
			$scope.url = '/imgs/tiles/prison_floor.png';
			$scope.load_image = function(){
				$scope.image = new Image();
				$scope.image.onload = $scope.handel_load_image;
				$scope.image.src = $scope.url;
			}
			$scope.getMousePos = function(canvas, evt) {
				var rect = $scope.spriteCanvas.getBoundingClientRect();
				return {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
			}
			$scope.handel_load_image = function(){
				$scope.render();
			}
			$scope.render = function(){
				$scope.spriteContext.clearRect(
					0,
					0,
					$scope.spriteCanvas.width,
					$scope.spriteCanvas.height
				);
				$scope.spriteContext.drawImage(
					$scope.image,
					0,
					0,
					$scope.image.width,
					$scope.image.height
				)
			}

			$scope.make_transparent = function(){
				var imageData = $scope.spriteContext.getImageData(0,0, $scope.image.width, $scope.image.height);
				var data = imageData.data;
				for(var i = 0; i < data.length; i += 4) {
					if(
						($scope.selected_color.data[0] == data[i]) &&
						($scope.selected_color.data[1] == data[i + 1]) &&
						($scope.selected_color.data[2] == data[i + 2])
					){
						data[i + 3] = 0;
					}


				}
				imageData.data = data;
				$scope.spriteContext.putImageData(imageData, 0, 0);
				$scope.data_obj_rendered = $scope.spriteCanvas.toDataURL();

			}
			$scope.save_binary = function() {
				var formData = new FormData();
				formData.append('username', 'johndoe');
				formData.append('id', 123456);

				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/server', true);
				xhr.onload = function(e) {
					//Blah
				};

				xhr.send(formData);
			}
			$scope.tile = function(){
				$scope.render();
				$scope.spriteContext.fillStyle = "#000000";
				for(var x = 0; x < $scope.image.width; x += $scope.selector_width){
					for(var y = 0; y < $scope.image.height; y += $scope.selector_height){

						$scope.spriteContext.strokeRect(
							x,
							y,
							$scope.selector_width,
							$scope.selector_height
						);
					}
				}
			}
		}
	]
)
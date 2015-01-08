angular.module('sprite_util')
.controller('SpriteUtilController', [
		'$document',
		'$scope',
		'$cookies',
		function($document,$scope, $cookies){
			$scope.data_obj_rendered = $cookies.data_obj || '{}';
			try{
				$scope.data_obj = JSON.parse($scope.data_obj_rendered);
			}catch(e){
				$scope.data_obj = {}
			}
			$scope.mode = $cookies.mode || 'animate';
			$scope.jump = $cookies.jump || true;
			$scope.type = $cookies.type  || 'player-1';
			$scope.facing = $cookies.facing  || 'up';
			$scope.state = $cookies.state  || 'default';
			$scope.selector_width = ($cookies.selector_width && parseInt($cookies.selector_width))  || 75;
			$scope.selector_height = ($cookies.selector_height && parseInt($cookies.selector_height)) || 38;
			$scope.selector_x = ($cookies.selector_x && parseInt($cookies.selector_x)) || 0;
			$scope.selector_y = ($cookies.selector_y && parseInt($cookies.selector_y)) || 0;
			$scope.url = $cookies.url || '/imgs/npcs/dogmeat.gif';
			$scope.mouseStartPos = {x:0, y:0};
			$scope.mouseEndPos = {x:0, y:0};
			$scope.fresh_obj = function(){
				$scope.data_obj = {};
				$scope.data_obj_rendered = JSON.stringify($scope.data_obj);
			}
			$scope.updateCookies = function(){
				//$cookies.data_obj = $scope.data_obj_rendered;
				$cookies.mode = $scope.mode;
				$cookies.url = $scope.url;
				$cookies.facing = $scope.facing;
				$cookies.type = $scope.type;
				$cookies.state = $scope.state;
				$cookies.jump = $scope.jump;
				$cookies.selector_width = $scope.selector_width;
				$cookies.selector_height = $scope.selector_height;
				$cookies.selector_x = $scope.selector_x;
				$cookies.selector_y = $scope.selector_y;
				$cookies.url = $scope.url;

			}
			$scope.mousedown_listener = function(evt) {
				$scope.mouseStartPos = $scope.getMousePos($scope.spriteCanvas, evt);

				//console.log(message);
				var pixel_data = $scope.spriteContext.getImageData($scope.mouseStartPos.x, $scope.mouseStartPos.y, 1, 1);
				$scope.selected_color = pixel_data;
				$scope.$digest();
			}
			$scope.mouseup_listener = function(evt){
				$scope.mouseEndPos = $scope.getMousePos($scope.spriteCanvas, evt);

				$scope.selector_x = $scope.mouseStartPos.x;
				$scope.selector_y = $scope.mouseStartPos.y;
				$scope.selector_width = $scope.mouseEndPos.x - $scope.mouseStartPos.x;
				$scope.selector_height = $scope.mouseEndPos.y - $scope.mouseStartPos.y;
				$scope.$digest();

			}
			$document.bind('keypress', function (e) {
				var key = null;
				switch (e.which) {
					case(13):
						key = 'enter';
						break;
					default:
						key = String.fromCharCode(e.which);
				}
				//$rootScope.$broadcast('keypress', e, key);
				$scope.keypress_handeler(key);
			});
			$scope.$watch(
				function(){
					return $scope.data_obj_rendered != JSON.stringify($scope.data_obj);
				},
				function(){
					$scope.data_obj_rendered = JSON.stringify($scope.data_obj);
					$scope.data_obj_arr = [];
					for(var i in $scope.data_obj){
						$scope.data_obj_arr.push($scope.data_obj[i]);
					}
					$scope.updateCookies();
				}
			);
			$scope.$watch('url', function(){ $scope.updateCookies();  });
			$scope.$watch('mode', function(){ $scope.updateCookies();  });
			$scope.$watch('type', function(){ console.log($scope.type); $scope.updateCookies();  });
			$scope.$watch('state', function(){ console.log($scope.state); $scope.updateCookies();  });
			$scope.$watch('facing', function(){ console.log($scope.facing); $scope.updateCookies();  });
			$scope.$watch('selector_x', function(){ $scope.updateCookies(); $scope.renderSelected(); });
			$scope.$watch('selector_y', function(){ $scope.updateCookies(); $scope.renderSelected(); });
			$scope.$watch('selector_height', function(){ $scope.updateCookies(); $scope.renderSelected(); });
			$scope.$watch('selector_width', function(){ $scope.updateCookies(); $scope.renderSelected(); });
			$scope.load_image = function(){
				$scope.image = new Image();
				$scope.image.onload = $scope.handel_load_image;
				$scope.image.src = $scope.url;
			}
			$scope.getMousePos = function(canvas, evt) {
				var rect = $scope.spriteCanvas[0].getBoundingClientRect();
				return {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
			}

			$scope.handel_load_image = function(){
				$scope.render();
			}
			$scope.render = function(){
				if(!$scope.image){
					return;
				}
				$scope.spriteCanvas = angular.element('<canvas id="sprite_canvas" height="' + $scope.image.height +  '"  width="' + $scope.image.width + '"></canvas>');

				angular.element(document.getElementById('sprite_canvas')).replaceWith($scope.spriteCanvas);

				$scope.spriteContext = $scope.spriteCanvas[0].getContext("2d");

				$scope.spriteCanvas[0].addEventListener('mousedown', $scope.mousedown_listener, false);
				$scope.spriteCanvas[0].addEventListener('mouseup', $scope.mouseup_listener, false);
				//Clear Canvis


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
			$scope.keypress_handeler = function(key){
				switch(key){
					case('d'):
						//Hop right
						if($scope.jump){
							$scope.selector_x += $scope.selector_width;
						}else{
							$scope.selector_x += 1;//$scope.selector_width;
						}
					break;
					case('a'):
						//Hop left
						if($scope.jump){
							$scope.selector_x -= $scope.selector_width;
						}else{
							$scope.selector_x -= 1;//$scope.selector_width;
						}
					break;
					case('s'):
						//Hop down
						if($scope.jump){
							$scope.selector_y += $scope.selector_height;
						}else{
							$scope.selector_y += 1;//$scope.selector_width;
						}
					break;
					case('w'):
						//Hop left
						if($scope.jump){
							$scope.selector_y -= $scope.selector_height;
						}else{
							$scope.selector_y -= 1;//$scope.selector_width;
						}
					break;
					case('enter'):
						$scope.addFrame();
					break;

				}
				$scope.$digest();
			}
			$scope.addFrame = function(){
				var new_canvas = angular.element('<canvas width="' + $scope.selector_width + '" height="' + $scope.selector_height + '"></canvas>');
				var new_context = new_canvas[0].getContext('2d');
				new_context.drawImage(
					$scope.image,
					$scope.selector_x,
					$scope.selector_y,
					$scope.selector_width,
					$scope.selector_height
				)
				var data_url = new_canvas[0].toDataURL();



				if(!$scope.data_obj[$scope.type]){
					$scope.data_obj[$scope.type] = {};
				}
				if(!$scope.data_obj[$scope.type][$scope.state]){
					$scope.data_obj[$scope.type][$scope.state] = {};
				}
				if(!$scope.data_obj[$scope.type][$scope.state][$scope.facing]){
					$scope.data_obj[$scope.type][$scope.state][$scope.facing] = {};
				}
				if(!$scope.data_obj[$scope.type][$scope.state][$scope.facing].frames){
					$scope.data_obj[$scope.type][$scope.state][$scope.facing].frames = [];
				}
				$scope.data_obj[$scope.type][$scope.state][$scope.facing].src =  $scope.url;

				$scope.data_obj[$scope.type][$scope.state][$scope.facing].frames.push({
					x:$scope.selector_x,
					y:$scope.selector_y,
					width:$scope.selector_width,
					height:$scope.selector_height,
					data_url:data_url
				});

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


			}
			$scope.save_binary = function() {
				var formData = new FormData();

				formData.append('image_loc', $scope.url);
				formData.append('image', $scope.toBlob());

				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/sprite_util', true);
				xhr.onload = function(e) {
					//Blah
				};

				xhr.send(formData);
			}
			$scope.toBlob = function(dataURI) {
				if(!dataURI){
					dataURI = $scope.spriteCanvas.toDataURL();
				}
				// convert base64/URLEncoded data component to raw binary data held in a string
				var byteString;
				if (dataURI.split(',')[0].indexOf('base64') >= 0)
					byteString = atob(dataURI.split(',')[1]);
				else
					byteString = unescape(dataURI.split(',')[1]);

				// separate out the mime component
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

				// write the bytes of the string to a typed array
				var ia = new Uint8Array(byteString.length);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}

				return new Blob([ia], {type:mimeString});
			}
			$scope.tile = function(){
				$scope.render();
				if(!$scope.image){
					return false;
				}
				$scope.spriteContext.fillStyle = "#00ff00";
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
			$scope.tileSplit = function(){
				var i = 0;

				var new_canvas = angular.element('<canvas width="' + $scope.selector_width + '" height="' + $scope.selector_height + '"></canvas>');
				var new_context = new_canvas[0].getContext('2d');
				for(var x = 0; x < $scope.image.width; x += $scope.selector_width){
					for(var y = 0; y < $scope.image.height; y += $scope.selector_height){

						$scope.spriteContext.clearRect(
							x,
							y,
							$scope.selector_width,
							$scope.selector_height
						);
						new_context.drawImage(
							$scope.image,
							x,
							y,
							$scope.selector_width,
							$scope.selector_height
						)


						var data_url = new_canvas[0].toDataURL();
						var type = $scope.type + '-' + i;
						$scope.data_obj[type] = {
							type:type,
							src:data_url
						}
						i += 1;


					}
				}
				//$scope.$digest();


			}
			$scope.renderSelected = function(){

				$scope.render();
				if(!$scope.image){
					return false;
				}
				$scope.spriteContext.strokeStyle = "#00ff00";

				$scope.spriteContext.strokeRect(
					$scope.selector_x,
					$scope.selector_y,
					$scope.selector_width,
					$scope.selector_height
				);

			}
		}
	]
)
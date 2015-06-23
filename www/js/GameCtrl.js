

KayApp.controller('GameCtrl', function( $scope, $cordovaDeviceMotion, $rootScope ){


	var box = document.getElementById('box'),
	boxPos = 10,
	boxVelocity = 0.1,
	limit = 300,
	lastTimeStamp = 0,
	maxFPS = 60,
	delta = 0,
	timeStep = 1000 / 60,
	numUpdateSteps = 0,
	fps = 60,
	framesThisSecond = 0,
	lastFpsUpdate = 0,
	frameID,
	running = false,
	started = false;

	
	$scope.Result;

	document.addEventListener("deviceready", function () {

		var options = { frequency: timeStep };

		var watch = $cordovaDeviceMotion.watchAcceleration(options);
	    watch.then(
	      null,
	      function(error) {
	      // An error occurred
	      },
	      function(result) {
	        // var X = result.x;
	        // boxVelocity = Math.floor(result.y / 10);
	        // var Z = result.z;
	        // var timeStamp = result.timestamp;
	        // $scope.Result = (result.y / 10).toFixed(2);
	        boxVelocity = (result.y / 10).toFixed(2);
	    });
	});



	start();




	

	function begin() {

	}

	function end() {

	}

	function stop() {
		running = false;
		started = false;
		cancelAnimationFrame(frameID);
		$rootScope.GameOn = false;
	}

	function start() {
		if (!started) {
			started = true;

			$rootScope.GameOn = true;

			frameID = requestAnimationFrame(function(timestamp) {
				draw(1);
				running = true;
				lastTimeStamp = timestamp;
				lastFpsUpdate = timestamp;
				framesThisSecond = 0;
				frameID = requestAnimationFrame(mainLoop);
			});
		};
	}

	function panic() {
		delta = 0;
	}

	function draw() {
		box.style.top = boxPos + 'px';
	}

	function update(delta) {
		// if (boxPos < window.outerHeight && boxPos > 0) {
			boxPos += boxVelocity * delta;
		// };
	}

	function mainLoop(timestamp) {

		if (timestamp < lastTimeStamp + (1000 / maxFPS)) {
			frameID = requestAnimationFrame(mainLoop);
			return;
		};

//		Calculate Frames this second
		if (timestamp > lastFpsUpdate + 1000) {
			fps = 0.25 * framesThisSecond + (1 - 0.25) * fps;
			lastFpsUpdate = timestamp;
			framesThisSecond = 0;
		};
		framesThisSecond++;

//		Calculate time between updates (delta)
		delta += timestamp - lastTimeStamp;
		lastTimeStamp = timestamp;

		while (delta >= timeStep) {
			update(timeStep);
			delta -= timeStep;
			if (++numUpdateSteps >= 240) {
				panic();
				break;
			};
		}
		
		draw();
		frameID = requestAnimationFrame(mainLoop);
		
	} // End Main Loop


});


KayApp.controller('GameCtrl', function( $scope, $cordovaDeviceMotion, $rootScope, $state ){

	$scope.StopGame = function() {
		stop();
		$state.go('app.home');
	}


	var box = document.getElementById('box'),
	boxPos = 10,
	itemPos = 0,
	boxVelocity = 0.1,
	itemVelocity = 0.05,
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
	started = false,
	timeBetweenSpawns = 5000,
	lastSpawn = 0,
	itemsToSpawn = 1,
	totalItems = 0,
	allItems = [],
	itemPositions = [];

	
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
	        boxVelocity = (result.y / 10).toFixed(2);
	    });
	});

	// start();




	// GAME LOOP

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
		
		for (var i = 0; i < allItems.length; i++) {
			allItems[i].style.right = itemPositions[i] + 'px';
		};
	}

	function update(delta, timestamp) {
		boxPos += boxVelocity * delta;
		// itemPos += itemVelocity * delta;

		for (var i = 0; i < itemPositions.length; i++) {
			itemPositions[i] += itemVelocity * delta;
		};

		if (timestamp > lastSpawn + timeBetweenSpawns) {
			spawn(timestamp);
		};
		

	}

	function spawn(timestamp) {
		lastSpawn = timestamp;
		
		for (var i = 0; i < itemsToSpawn; i++) {
			$('._jsGameArea').append('<p class="_jsItem GameItem" id="item'+totalItems+'""></p>');
			var item = document.getElementById('item'+totalItems);
			allItems.push(item);
			totalItems++;
			itemPositions.push(itemPos);
		};
		itemsToSpawn++;
		console.log(allItems);
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
			update(timeStep, timestamp);
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
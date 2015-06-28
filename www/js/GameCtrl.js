

KayApp.controller('GameCtrl', function( $scope, $cordovaDeviceMotion, $rootScope, $state ){

	$scope.StopGame = function() {
		stop();
		$state.go('app.home');
	}


	var box = document.getElementById('box'),
	gameArea = document.getElementById('gameArea'),
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
	accelerationRate = 0.008,
	spaceBetweenObjects = -80;
	allItems = [];

	
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

	start();




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
			allItems[i].item.style.right = allItems[i].position + 'px';

			if (allItems[i].item.style.right.split('.',1) > window.outerWidth) {
				$(allItems[i].item).remove();
			};
		};
	}

	function update(delta, timestamp) {
		boxPos += boxVelocity * delta;

		for (var i = 0; i < allItems.length; i++) {
			var item = allItems[i];
			item.position += ((Math.random().toFixed(1))/5) + item.accel * delta;
			item.accel += accelerationRate;
			if (item.position > 0 && !item.accelerated) {
				item.accel = accelerationRate;
				item.accelerated = true;
			};
			//Check for collision
			if (item.item.style.top) {};
		};

		if (timestamp > lastSpawn + timeBetweenSpawns) {
			spawn(timestamp);
		};
		

	}

	function spawn(timestamp) {
		lastSpawn = timestamp;
		
		for (var i = 0; i < itemsToSpawn; i++) {
			var height = (Math.floor(Math.random() * 9) + 1);
			var calcedHeight = (screen.height / 10) * height;
			$('._jsGameArea').append('<p class="_jsItem GameItem" style="top: '+calcedHeight+'px;" id="item'+allItems.length+'""></p>');
			var item = document.getElementById('item'+allItems.length);
			allItems.push({item : item, position : i * spaceBetweenObjects, accel : accelerationRate});
		};
		itemsToSpawn++;
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
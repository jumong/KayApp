


KayApp.controller('ProductCtrl', function($scope, $stateParams, $http, API, $ionicLoading, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $timeout){
	$scope.Type = $stateParams.type;
	$scope.ProductApplications = {};
	$scope.Applications;

	if ($scope.Type) {
		$scope.Loading();
	};

	$scope.hasImage = function(data) {
		if (data.Image == undefined) {
			return true;
		} else{
			return false;
		}
	}

	// End in app browser

	API.GetProducts().then(function(body) {
		var projects = $(body.data).find('.project');

		$.each(projects, function(index, entry) {
			for (var i = 4; i < $(entry).classes().length; i++) {
				var thisClass = $(entry).classes()[i];
				$scope.ProductApplications[thisClass] = [];
			};

		}); //End Each

		$.each(projects, function(index, entry) {

			for(x in $scope.ProductApplications) {
				if ($(entry).hasClass(x)) {
					$scope.ProductApplications[x].push({
						Title : $(entry).find('a.projectThumb').attr('title'),
						Link : $(entry).find('a.projectThumb').attr('href'),
						Image : $(entry).find('img').attr('src'),
					})
				};
			}

		}); //End Each

		$scope.Applications = $scope.ProductApplications[$scope.Type];
	});

	$scope.$on('ngRepeatFinished', function() {
	    $timeout(function() {
	    	$ionicLoading.hide();
	    }, 500)
	});

});



// Title : $(entry).find('h4').text().replace(/\s+/g, " ")



KayApp.controller('ProductCtrl', function($scope, $stateParams, $http, API, $ionicLoading, $ionicPlatform, $cordovaInAppBrowser, $rootScope, $timeout){
	$scope.Type = $stateParams.type;
	$scope.ProductApplications = {};
	$scope.Applications;

	if ($scope.Type) {
		$scope.Loading();
	};

	$scope.hasImage = function(data) {
		if (data.Image == undefined) {
			return true
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
	},function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
    });

	$scope.$on('ngRepeatFinished', function() {
	    $timeout(function() {
	    	$ionicLoading.hide();
	    }, 500)
	});

	$scope.GetType = function(type) {
		switch(type){
			case 'hydraulic-construction':
				return 'Hydraulic Construction'
				break;
			case 'erosion-control':
				return 'Erosion Control'
				break;
			case 'filtration-and-drainage':
				return 'Filtration & Drainage'
				break;
			case 'other':
				return 'Other'
				break;
			case 'diy':
				return 'DIY'
				break;
			case 'reinforcement-separation':
				return 'Reinforcement & Seperation'
				break;
			case 'road-maintenance-rehabilitation':
				return 'Road Maintenance & Rehabilitation'
				break;
			case 'water-and-waste-containment':
				return 'Water & Waste Containment'
				break;
			default:
				return ''
				break;
		}
	}

});



















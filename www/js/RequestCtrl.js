



KayApp.controller('RequestCtrl', ['$rootScope','$scope','$stateParams','Local','Request','GetOptions','Regions', 'Enquiry', 'API', '$timeout', '$ionicLoading', '$ionicPopup', '$state', function($rootScope, $scope, $stateParams, Local, Request, GetOptions, Regions, Enquiry, API, $timeout, $ionicLoading, $ionicPopup, $state){
	$scope.Type = $stateParams.type;
	$scope.Heading;
	$scope.Regions = Regions.Get();
	$scope.Enquiry = {};
	$scope.Authorized = Local.GetLogin().LoggedIn;
	console.log('Authorized : ' + $scope.Authorized);

	$scope.Options = GetOptions($scope);

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		$scope.CheckLogin(toState.name);
	});

	if ($scope.Type == 'order') {
		$scope.Request = Request();
	} else{
		$scope.Enquiry = Enquiry();
	}

	$scope.SendEnquiry = function(data) {
		$scope.Loading();
		API.SendRequestEnquiry(data).then(function(response) {
			if (response.data.success) {
				$scope.HideLoader();
				$scope.showAlert();
			};
		})
	}

	$scope.ClearForm = function() {
		if ($scope.Type == 'order') {
			$scope.Request = Request(true);
		} else{
			$scope.Enquiry = Enquiry(true);
		}
	}

	$scope.PopulateForm = function() {
		if ($scope.Type == 'order') {
			$scope.Request = Request();
		} else{
			$scope.Enquiry = Enquiry();
		}
	}

	

	$scope.CheckLogin = function(toState) {

		if (!Local.GetLogin().LoggedIn && Local.GetLogin() && toState == 'app.request') {
			API.CheckAuthorized().then(function(response) {
				if (response.data == true) {
					Local.UpdateUserStatus(response.data);
					$scope.Authorized = true;
				};
			});
		};

		if (toState == 'app.request') {

			if (!Local.GetLogin().User && !Local.GetLogin().LoggedIn) {
				$scope.OpenNewAccount();
				return;
			};

			if (!Local.GetLogin().LoggedIn) {
				$scope.Authorized = false;
				return;
			};
			
		};
	}

	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: 'Thank You!',
			template: 'We will be in contact soon.'
		});
		alertPopup.then(function(res) {
			console.log('Thank you for not eating my delicious ice cream cone');
		});
	};

	$scope.CheckLogin('app.request');

	

	

	
}])
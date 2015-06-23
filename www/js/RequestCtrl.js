



KayApp.controller('RequestCtrl', ['$rootScope','$scope','$stateParams','Local','Request','GetOptions','Regions', 'Enquiry', 'API', '$timeout', '$ionicLoading', '$ionicPopup', '$state', 'TakePhoto', '$state', function($rootScope, $scope, $stateParams, Local, Request, GetOptions, Regions, Enquiry, API, $timeout, $ionicLoading, $ionicPopup, $state, TakePhoto, $state){
	$scope.Type = $stateParams.type;
	$scope.Heading;
	$scope.Regions = Regions.Get();
	$scope.Enquiry = {};
	$scope.Authorized = Local.GetLogin().Authorized;
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
		if ($scope.Photo) {
			data.photo = $scope.Photo;
		};
		data.EnquiryType = $scope.Heading;
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

		if (!Local.GetLogin().Authorized && Local.GetLogin() && toState == 'app.request') {
			API.CheckAuthorized().then(function(response) {
				if (response.data == true) {
					Local.UpdateUserStatus(response.data);
					$scope.Authorized = true;
				};
			});
		};

		if (toState == 'app.request') {

			if (!Local.GetLogin().User) {
				$scope.OpenNewAccount();
				return;
			};

			if (!Local.GetLogin().LoggedIn) {
				var pw = prompt('Please enter your password');
				if (pw === Local.GetLogin().User.password) {
					Local.Login();
				} else {
					alert('This password is incorrect');
				}
				return;
			};
		};
	}

	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: 'Thank You!',
			template: 'A representative from Kaytech will be in contact with you shortly. If you require any further assistance please contact us on <a href="tel:+27317172300">+27 31 717 2300</a>'
		});
		alertPopup.then(function(res) {
			$state.go('app.home');
		});
	};

	$scope.CheckLogin('app.request');

	$scope.Remove = function() {
		$scope.Photo = {};
		if ($scope.Enquiry.photo) {
			delete $scope.Enquiry.photo;
		};
		if ($scope.Request.photo) {
			delete $scope.Request.photo;
		};
	}

	
	$scope.ChooseSourceAndTakePhoto = function() {
	  $scope.Photo = {};

	  var myPopup = $ionicPopup.show({
	    title: 'Attach new picture from..',
	    scope: $scope,
	    buttons: [
	      {
	        text: '<b>Camera</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          $scope.FromCam = 1;
	        }
	      },
	      {
	        text: '<b>Photo Library</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          $scope.FromCam = 0;
	        }
	      }

	    ]
	  });
	  myPopup.then(function(res) {
	    TakePhoto($scope.FromCam, $scope.Photo);
	  });
	 };

	 // $scope.ChooseSourceAndTakePhoto();

	
}])






















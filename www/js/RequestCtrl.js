



KayApp.controller('RequestCtrl', ['$rootScope','$scope','$stateParams','Local','Request','GetOptions','Regions', 'Enquiry', 'API', '$timeout', '$ionicLoading', '$ionicPopup', '$state', 'TakePhoto', '$state', 'Alert', function($rootScope, $scope, $stateParams, Local, Request, GetOptions, Regions, Enquiry, API, $timeout, $ionicLoading, $ionicPopup, $state, TakePhoto, $state, Alert){
	$scope.Type = $stateParams.type;
	$scope.Heading;
	$scope.Regions = Regions.Get();
	$scope.Enquiry = {};
	$scope.Authorized = Local.GetLogin().Authorized;
	$scope.Photos = [];
	console.log('Authorized : ' + $scope.Authorized);

	$scope.Options = GetOptions($scope);

	$scope.PhotoInput = function() {
		if ($rootScope.Platform == 'macintel' || $rootScope.Platform == 'win32') {
			return true;
		} else {
			return false;
		}
	}

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
		if ($scope.Photos.length) {
			data.photo = $scope.Photos;
		};
		data.EnquiryType = $scope.Heading;
		API.SendRequestEnquiry(data).then(function(response) {
			if (response.data.success) {
				$scope.HideLoader();
				$scope.showAlert();
			};
		},function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong. Please try again.', function() {
            $scope.canReset=false;
         });
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
			},function (error) {           
                  $rootScope.HideLoader(); 
                  Alert('Error', error.data || 'Something went wrong. Please try again.', function() {
                    $scope.canReset=false;
                 });
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
            templateUrl: "templates/request-response.html"
        });
		alertPopup.then(function(res) {
			$state.go('app.home');
		});
	};

	$scope.CheckLogin('app.request');

	$scope.Remove = function(photo, index) {
		$scope.Photos.splice(index, 1);
	}

	$scope.FileSelect = function(name) {
		$(name).click();
	}

	


 	$scope.closePopup = false;


	$scope.ChooseSourceAndTakePhoto = function() {
	  $scope.Photo = {};
	 

	  if ($rootScope.Platform == 'macintel' || $rootScope.Platform == 'win32') {
	  	$scope.FileSelect('#photo');
	  } else{
	  var myPopup = $ionicPopup.show({	
	  		cssClass:'photoAattachment',
	  		templateUrl:'templates/photo-attachment.html',
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
		    ],

		  });

		  myPopup.then(function(res) {
		    TakePhoto($scope.FromCam, $scope.Photo, $scope.Photos);
		  });
		   
		   $scope.closePopup=function(){		   
			myPopup.close();
		   }

	  }
	  
	 }; 
	

}])






















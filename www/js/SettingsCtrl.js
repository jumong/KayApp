

KayApp.controller('SettingsCtrl', function( $scope , API , Local, $state , $rootScope , Alert,Platform){
	$scope.User = Local.GetLogin().User;
	$scope.Activities = Local.GetActivities();
	$scope.NewPassword = {};
    $scope.phone_number = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;

	$rootScope.GoUrl = function(url) {
	    $state.go(url);
	    $rootScope.settings.hide();
	    $scope.closeLogin();
	}
    
    $rootScope.GoTo = function (url, param, loc) {
	    if (Platform.isWindowsPhone) {
	        $state.go(url, param);
	    } else {
	        $state.go(url, param);
	    }
	}

	$scope.ChangeGameSpeed = function(value) {
		$rootScope.TimeStep = value;
	}

	$scope.SendUpdate = function() {
        
   



	    if ($scope.NewUser) {
	        $scope.User.address = $scope.NewUser.address;
	        $scope.User.postalAddress = $scope.NewUser.postalAddress;
	    }

        alert(JSON.stringify($scope.User));
        return;

	    if (!$scope.User.address[0]) {
	        Alert('Error', 'Please enter address line 1 in physical address.');
	        return;
	    }

	    if (!$scope.User.address[3]) {
	        Alert('Error', 'Please enter city in physical address.');
	        return;
	    }

	    if ($scope.User.region == 'Region') {
	        Alert('Error', 'Please select region in physical address.');
	        return;
	    };

	    if (!$scope.User.address[4]) {
	        Alert('Error', 'Please enter ZIP code in physical address.');
	        return;
	    }


	    if (!$scope.User.postalAddress[0]) {
	        Alert('Error', 'Please enter address line 1 in postal address.');
	        return;
	    }
	    if (!$scope.User.postalAddress[3]) {
	        Alert('Error', 'Please enter city in postal address.');
	        return;
	    }

	    if (!$scope.User.postalAddress[4]) {
	        Alert('Error', 'Please enter ZIP code in postal address.');
	        return;
	    }
        
        
        $rootScope.Loading();
		API.UpdateUser($scope.User).then(function(response) {
            if(response.data.success)
                Local.UpdateLogin($scope.User);
			
                Alert('Response', response.data.message);
            $scope.NewUser = {};
                        
            
			$rootScope.HideLoader();
		},function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong. Please try again.', function() {
            $scope.canReset=false;
         });
        });
	}

	$scope.LogOutUser = function() {
		localStorage.KayAppEmail = JSON.parse(localStorage.KayApp).User.emailaddress;
	    if (localStorage.KayApp) {
			delete localStorage.KayApp;
			Alert('Info','User logged out');
            $scope.loginData = {};			
			$scope.LoginFormData = {};
			$rootScope.LoggedIn = Local.GetLogin().LoggedIn;
			$state.go('app.home');            
			$rootScope.settings.hide();
	    };
	}

	$scope.SendPasswordChange = function() {
		$rootScope.Loading();
		API.ChangePassword($scope.NewPassword).then(function(res) {
			$rootScope.HideLoader();
			if (res.data.success) {
				Alert('Success', res.data.message);
				Local.UpdatePassword($scope.NewPassword.newPassword);
				$state.go('app.home');
			} else{
				Alert('Error', res.data.message);
			}
		},function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong. Please try again.', function() {
            $scope.canReset=false;
         });
    });
	}
    
    $scope.UpdatePostalAddress = function () {

    $scope.User = Local.GetLogin().User;
        if($scope.NewUser === undefined)
            $scope.NewUser =$scope.User;

    if (!$scope.NewUser.postalAddress[0])
        $scope.NewUser.postalAddress[0] = $scope.User.postalAddress[0];

    if (!$scope.NewUser.postalAddress[1])
        $scope.NewUser.postalAddress[1] = $scope.User.postalAddress[1];

    if (!$scope.NewUser.postalAddress[2])
        $scope.NewUser.postalAddress[2] = $scope.User.postalAddress[2];

    if (!$scope.NewUser.postalAddress[3])
        $scope.NewUser.postalAddress[3] = $scope.User.postalAddress[3];

    if (!$scope.NewUser.postalAddress[4])
        $scope.NewUser.postalAddress[4] = parseInt( $scope.User.postalAddress[4]);

    $scope.postalAddressModal.show();
}

    $scope.UpdateAddress = function () {
        
       
    $scope.User = Local.GetLogin().User;
        
    if($scope.NewUser === undefined)
        $scope.NewUser =$scope.User;

    if (!$scope.NewUser.address[0])
        $scope.NewUser.address[0] = $scope.User.address[0];

    if (!$scope.NewUser.address[1])
        $scope.NewUser.address[1] = $scope.User.address[1];

    if (!$scope.NewUser.address[2])
        $scope.NewUser.address[2] = $scope.User.address[2];

    if (!$scope.NewUser.address[3])
        $scope.NewUser.address[3] = $scope.User.address[3];

    $scope.NewUser.address[4] = parseInt( $scope.User.address[4]);

    if ($scope.NewUser.region == 'Region')
        $scope.NewUser.region = $scope.User.region;


    $scope.addressModal.show();
}
    
    
});
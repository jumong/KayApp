

KayApp.controller('SettingsCtrl', function( $scope , API , Local, $state , $rootScope ,$ionicModal, Alert,Platform){
	$scope.User = Local.GetLogin().User;
	$scope.Activities = Local.GetActivities();
	$scope.NewPassword = {};
    $scope.phone_number = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
    
    
    
     $ionicModal.fromTemplateUrl('templates/address-modal-update.html',{
    scope : $scope,
    animation : 'scale-in'
  }).then(function(modal){
    $scope.addressUpdateModal = modal;
  });


  $ionicModal.fromTemplateUrl('templates/postal-modal-update.html',{
    scope : $scope,
    animation : 'scale-in'
  }).then(function(modal){
    $scope.postalAddressUpdateModal = modal;
  });

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

<<<<<<< HEAD
	$scope.SendUpdate = function() {
 
	    if ($scope.NewUser) {
	        $scope.User.address = $scope.NewUser.address;
	        $scope.User.postalAddress = $scope.NewUser.postalAddress;
	    }

        alert(JSON.stringify($scope.User));
        return;
=======
	$scope.SendUpdate = function() {        
>>>>>>> origin/master

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
;
                        
            
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
    $scope.postalAddressUpdateModal.show();
}

    $scope.UpdateAddress = function () {  
        $scope.addressUpdateModal.show();
}
    
    
     $scope.CloseAddress = function() {  

    var a = '';
    $scope.User.address.forEach(function(i){
    if(i == $scope.User.address[0] ){
           a=i;
         }else{
           if(i!=='')
              a+= ', '+i; 
        }
    });

    if(a==='')
      $scope.address='Work Physical Address';
    else      
      $scope.address=$scope.User.address[0]; 


    $scope.addressUpdateModal.hide();    
  }
  
   $scope.ClosePostalAddress = function(){

    var p = '';
    $scope.User.postalAddress.forEach(function(i){
    if(i == $scope.User.postalAddress[0] ){
          p=i;
        } else{

            if(i!=='')
              p+=  ', '+i; 
          
        }
    });

     
    if(p==='')
      $scope.postal='Work Postal Address';
    else      
       $scope.postal=$scope.User.postalAddress[0]; 
  
    
    $scope.postalAddressUpdateModal.hide();

  }
    
    
});


KayApp.controller('SettingsCtrl', function( $scope , API , Local, $state , $rootScope , Alert){
	$scope.User = Local.GetLogin().User;
	$scope.Activities = Local.GetActivities();
	$scope.NewPassword = {};

	$rootScope.GoUrl = function(url) {
	    $state.go(url);
	    $rootScope.settings.hide();
	    $scope.closeLogin();
	}

	$scope.SendUpdate = function() {
		$rootScope.Loading();
		API.UpdateUser($scope.User).then(function(response) {
			Alert('Response', response.data.message);
			$rootScope.HideLoader();
		},function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
        });
	}

	$scope.LogOutUser = function() {
	    if (localStorage.KayApp) {
			delete localStorage.KayApp;
			Alert('Info','User logged out');
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
          Alert('Error', error.data || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
    });
	}
});
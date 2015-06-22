

KayApp.controller('SettingsCtrl', function( $scope , API , Local, $state , $rootScope , Alert){
	$scope.User = Local.GetLogin().User;
	$scope.Activities = Local.GetActivities();

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
		});
	}

	$scope.LogOutUser = function() {
	    // var user;
	    // if (localStorage.KayApp) {
	    //   user = JSON.parse(localStorage.KayApp);
	    // };
	    // if (user.LoggedIn) {
	    //   user.LoggedIn = false;
	    //   localStorage.KayApp = JSON.stringify(user);
	    //   Alert('Info','User logged out');
	    //   $state.go('app.home');
	    //   $rootScope.settings.hide();
	    // }

	    if (localStorage.KayApp) {
			delete localStorage.KayApp;
			Alert('Info','User logged out');
			$state.go('app.home');
			$rootScope.settings.hide();
	    };
	}
});


KayApp.controller('SettingsCtrl', function( $scope , API , Local, $state , $rootScope ){
	$scope.User = Local.GetLogin().User;
	$scope.Activities = Local.GetActivities();
	$rootScope.LoggedIn = Local.GetLogin().LoggedIn;

	$rootScope.GoUrl = function(url) {
	    $state.go(url);
	    $rootScope.settings.hide();
	    $scope.closeLogin();
	}

	$scope.SendUpdate = function() {
		$rootScope.Loading();
		API.UpdateUser($scope.User).then(function(response) {
			alert(response.data.message);
			$rootScope.HideLoader();
		});
	}

	$scope.LogOutUser = function() {
	    var user;
	    if (localStorage.KayApp) {
	      user = JSON.parse(localStorage.KayApp);
	    };
	    if (user.LoggedIn) {
	      user.LoggedIn = false;
	      localStorage.KayApp = JSON.stringify(user);
	      alert('User logged out');
	      $state.go('app.home');
	      $rootScope.settings.hide();
	    }
	}
});
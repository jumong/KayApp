

KayApp.controller('SettingsCtrl', function( $scope , API , Local, $state , $rootScope ){
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
			alert(response.data.message);
			$rootScope.HideLoader();
		});
	}
});
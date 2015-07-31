


KayApp.controller('HomeCtrl', function($scope){
	$scope.$on('$ionicView.beforeEnter', function (e,config) {
	  config.enableBack = false;
	});
});

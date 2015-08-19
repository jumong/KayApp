


KayApp.controller('HomeCtrl', function($scope ,$ionicPlatform, AppAnalytics){
	$scope.$on('$ionicView.beforeEnter', function (e,config) {
	  config.enableBack = false;
	});    
    
     $ionicPlatform.ready(function(){        
            AppAnalytics.trackPageViewed('Home');      
   });
    
});



KayApp.controller('FindUsCtrl', ['$scope','$ionicPlatform','AppAnalytics', function($scope,$ionicPlatform,AppAnalytics){
	 $ionicPlatform.ready(function(){        
            AppAnalytics.trackPageViewed('Find Us');      
   });
}])
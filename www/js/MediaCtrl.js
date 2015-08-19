


KayApp.controller('MediaCtrl', ['$scope','$ionicPlatform','AppAnalytics', function($scope, $ionicPlatform, AppAnalytics){
    
    $ionicPlatform.ready(function(){        
            AppAnalytics.trackPageViewed('Media Info');      
   });
    
    
}])
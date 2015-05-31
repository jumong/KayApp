angular.module('starter.controllers', [])

.controller('AppCtrl', function(Regions, $scope, $ionicModal, $timeout, $state, $ionicPopup, Local, API, $rootScope, User, $ionicSideMenuDelegate, $cordovaInAppBrowser, $ionicLoading) {

  $scope.loginData = {};

  $scope.$watch(function() { 
    // console.log(!$ionicSideMenuDelegate.isOpen());
    $rootScope.ShowTabs = !$ionicSideMenuDelegate.isOpen();
  })

  $rootScope.Settings = function() {
    $scope.settings.show();
  }

  $ionicModal.fromTemplateUrl('templates/settings-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.settings = modal;
  });

  $ionicModal.fromTemplateUrl('templates/signup-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signUpModal = modal;
  });

  $scope.CloseNewAccount = function() {
    $scope.signUpModal.hide();
  }

  $scope.CloseNewAccountWithoutSignup = function() {
    $scope.signUpModal.hide();
    $state.go('app.home');
  }

  $scope.OpenNewAccount = function() {
    $scope.NewUser = new User();
    $scope.signUpModal.show();
  }

  $scope.closeLogin = function() {
    $scope.settings.hide();
  };

  $rootScope.GoTo = function(url, param) {
    $state.go(url, param);
  }

  $scope.Regions = Regions.Get();

  $scope.CreateUser = function() {
    API.CreateUser($scope.NewUser).then(function(data) {
      if (data.data.success) {
        Local.StoreLogin($scope.NewUser);
        $scope.CloseNewAccount();
        $state.go('app.home');
      } else {
        alert('Something went wrong, please try again.');
      }
      
    });
  }



  $scope.showPopup = function() {
    $scope.user = {}

    // An elaborate, custom popup
    // var myPopup = $ionicPopup.show({
    //   template: '<input type="username" ng-model="user.username"><input type="password" ng-model="user.password">',
    //   title: 'Please sign in',
    //   scope: $scope,
    //   buttons: [
    //     { text: 'Cancel' },
    //     {
    //       text: '<b>Ok</b>',
    //       type: 'button-positive',
    //       onTap: function(e) {
    //         if (!$scope.user) {
    //           e.preventDefault();
    //         } else {
    //           return $scope.user;
    //         }
    //       }
    //     }
    //   ]
    // });
    // myPopup.then(function(res) {
    //   if (res == undefined) {
    //     $scope.GoTo('app.home');
    //   };
    //   Local.StoreLogin(res);
    //   myPopup.close();
    // });

      var alertPopup = $ionicPopup.alert({
        title: 'Sorry!',
        template: 'Your account is being authorized, please try again soon.'
      });
      alertPopup.then(function(res) {
        $state.go('app.home');
      });


   };

   //Loading
    $rootScope.Loading = function() {
      $ionicLoading.show({
        content: '<i class="icon largeLoader ion-looping"></i>'
      });
    }

    $rootScope.HideLoader = function() {
      $ionicLoading.hide();
    }


   //In App Browser
   $rootScope.LoadURL = function(url) {
      var options = {
          location: 'no',
          clearcache: 'yes',
          toolbar: 'yes'
        };

        $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
          $cordovaInAppBrowser.insertCSS({
            code: '.headerCenter, #sidebar, #topBar, #main-menu, .mainFooter {display: none !important;}'
          });
      });

        $cordovaInAppBrowser.open(url, '_blank', options)
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
          });  
    }

   

  
});
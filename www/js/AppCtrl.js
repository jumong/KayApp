angular.module('starter.controllers', [])

.controller('AppCtrl', function(Regions, $scope, $ionicModal, $timeout, $state, $ionicPopup, Local, API, $rootScope, User, $ionicSideMenuDelegate, $cordovaInAppBrowser, $ionicLoading, $ionicUser, $ionicPush) {

  $scope.loginData = {};

  if (!Local.HasPushEnabled()) {

      $ionicUser.identify({
          // Generate GUID
          user_id: $ionicUser.generateGUID()
        }).then(function(res) {

          $ionicPush.register({
            canShowAlert: true, //Should new pushes show an alert on your screen?
            canSetBadge: true, //Should new pushes be allowed to update app icon badges?
            canPlaySound: true, //Should notifications be allowed to play a sound?
            canRunActionsOnWake: true, // Whether to run auto actions outside the app,
            onNotification: function(notification) {
              $scope.lastNotification = JSON.stringify(notification);
            }
          }).then(function(res) {
            Local.StorePushDetails(res);
            API.StoreTokenForPush(res).then(function(response) {
              
            });
          });
      });
  };


  $scope.$watch(function() { 
    // console.log(!$ionicSideMenuDelegate.isOpen());
    $rootScope.ShowTabs = !$ionicSideMenuDelegate.isOpen();
  })

  $rootScope.Settings = function() {
    $rootScope.settings.show();
  }

  $ionicModal.fromTemplateUrl('templates/settings-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $rootScope.settings = modal;
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

  $rootScope.CloseSettings = function() {
    $rootScope.settings.hide();
  }

  $rootScope.GoTo = function(url, param) {
    $state.go(url, param);
  }

  $scope.Regions = Regions.Get();

  $scope.CreateUser = function() {

    if ($scope.NewUser.password != $scope.NewUser.confirmPassword) {
      alert('Your passwords do not match.');
      return;
    };

    $rootScope.Loading();
    API.CreateUser($scope.NewUser).then(function(data) {
      if (data.data.success) {
        Local.StoreLogin($scope.NewUser);
        $scope.CloseNewAccount();
        $state.go('app.home');

        var alertPopup = $ionicPopup.alert({
          title: 'Thank You!',
          template: 'Your registration details are being verfied. You will receive an email notifying you when your KayApp user has been activated. Should not receive this notification within 24 hours please contact our offices on <a href="tel:+27317172300">+27 31 717 2300</a>'
        });
        alertPopup.then(function(res) {
          $state.go('app.home');
        });


      } else {
        alert('Something went wrong, please try again.');
      }
      $rootScope.HideLoader();
    });
  }



  $scope.showPopup = function() {
    $scope.user = {}

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
   $rootScope.LoadURL = function(url, type) {
      var options = {
          location: 'no',
          clearcache: 'yes',
          toolbar: 'yes'
        };

        var StringCheck;

        if (type) {
          switch(type){
            case 'diy':
              StringCheck = 'DIY'
              break;
            case 'filtration-and-drainage':
              StringCheck = 'Filtration'
              break;
            case 'erosion-control' :
              StringCheck = 'Erosion'
              break;
            case 'hydraulic-construction' :
              StringCheck = 'Hydraulic'
              break;
            case 'other' :
              StringCheck = 'Other'
              break;
            case 'reinforcement-separation' :
              StringCheck = 'Reinforcement'
              break;
            case 'road-maintenance-rehabilitation' :
              StringCheck = 'Road Maintenance'
              break;
            case 'water-and-waste-containment' :
              StringCheck = 'Waste Containment'
              break;
            default:
              StringCheck = 'Waste Containment'
              break;
          }
        };

        $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
          $cordovaInAppBrowser.insertCSS({
            code: '.headerCenter, #sidebar, #topBar, #main-menu, .mainFooter, .kayAppBox {display: none !important;}'
          });

          // Filter the Case Studies
          if (type) {
            $cordovaInAppBrowser.executeScript({
              code: '$(".case-studies").hide(); $( "h2:contains('+StringCheck+')" ).parent().parent().show()'
            });
          };

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
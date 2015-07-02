angular.module('starter.controllers', [])

.controller('AppCtrl', function(Regions, $scope, $ionicModal, $timeout, $state, $ionicPopup, Local, API, $rootScope, User, $ionicSideMenuDelegate, $cordovaInAppBrowser, $ionicLoading, $ionicUser, $ionicPush, Alert, RelationshipTypes, Industries, Platform, $location) {
  $scope.address ='Work Physical Address';
  $scope.postal='Work Postal Address';
  $scope.SameAsPhysical= {checked:true};
  $scope.canReset=false;
  $scope.loginData = {};
  $scope.IHaveAnAccount = false;
  $scope.LoginFormData = {};
  $rootScope.LoggedIn = Local.GetLogin().LoggedIn;
  $rootScope.GameOn = false;
  $scope.RelationshipTypes = RelationshipTypes();
  $scope.Industries = Industries();
  $rootScope.Platform = ionic.Platform.platform();
  $scope.IsWindows = Platform.isWindowsPhone; 

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
    $rootScope.ShowTabs = !$ionicSideMenuDelegate.isOpen();
  })

 

  $rootScope.Settings = function() {
    $rootScope.settings.show();
  }
  
  $ionicModal.fromTemplateUrl('templates/resetPassword-modal.html',{
    scope:$scope
  }).then(function(modal){
    $scope.resetPasswordModal=modal;
  });

  $ionicModal.fromTemplateUrl('templates/address-modal.html',{
    scope : $scope,
    animation : 'scale-in'
  }).then(function(modal){
    $scope.addressModal = modal;
  });


  $ionicModal.fromTemplateUrl('templates/postal-modal.html',{
    scope : $scope,
    animation : 'scale-in'
  }).then(function(modal){
    $scope.postalAddressModal = modal;
  });
    

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
  
  $scope.ShowPasswordReset = function(){
      $scope.Reset = new User();
      $scope.resetPasswordModal.show();
  }

  $scope.CancelResetPassword = function() {
    $scope.resetPasswordModal.hide();
  }
  
 $scope.ResetPassword = function(){ 
      $rootScope.Loading();   
      var data={}
      data.question =$scope.Reset.question;
      data.username=$scope.Reset.username;
      data.answer=$scope.Reset.answer;
       API.ResetPassword(data).then(function(res){
            if(res.data.success)
            {
                $rootScope.HideLoader();             
                Alert('Success !', res.data.message, function() {
                $scope.resetPasswordModal.hide();
                $state.go('app.home');
               });                
            }
           else
           {
                $rootScope.HideLoader(); 
                Alert('Invalid  email address!', res.data.message, function() {
                  $state.go('app.home');
               });
           }
       },function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
    });      
  }
  
  $scope.GetResetQuestion = function(){
     $rootScope.Loading();      
      API.GetResetQuestion($scope.Reset.username).then(function(res){
          if(res.data.success)
          {
            $rootScope.HideLoader(); 
            $scope.canReset =true;
            $scope.Reset.question = res.data.question;
          }
          else
          {   
               $rootScope.HideLoader(); 
              Alert('Invalid emailaddress!', res.data.message, function() {
                  $scope.canReset=false;
                });                           
          }      
      },function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
    })
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

  $rootScope.GoTo = function(url, param, loc) {
    if (Platform.isWindowsPhone) {
      $location.path(loc);
    } else {
      $state.go(url, param);
    }
    
  }

  $scope.Regions = Regions.Get();

  $scope.CreateUser = function() {


    if ($scope.NewUser.password != $scope.NewUser.confirmPassword) {
      Alert('Error','Your passwords do not match.');
      return;
    };

    $rootScope.Loading();

    $scope.NewUser.username = $scope.NewUser.emailaddress;

    API.CreateUser($scope.NewUser).then(function(data) {
      if (data.data.success) {
        Local.StoreLogin($scope.NewUser);
        $rootScope.LoggedIn = Local.GetLogin().LoggedIn;
        $scope.CloseNewAccount();
        $state.go('app.home');

        Alert('Thank You!', data.data.message, function() {
          $state.go('app.home');
        });


      } else {
        alert('Something went wrong, please try again.');
      }
      $rootScope.HideLoader();
    },function (error) {           
          $rootScope.HideLoader(); 
          Alert('Error', error.data || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
    });
  }

  $scope.LoginUser = function() {
    $rootScope.Loading();
    API.Login($scope.LoginFormData).then(function(res) {
      if (res.data.success) {
        var user = res.data.user;
        user.password = $scope.LoginFormData.password;
        Local.StoreLogin(user);
        $rootScope.LoggedIn = Local.GetLogin().LoggedIn;
      };
       Alert('Response', res.data.message);
       $rootScope.HideLoader();
       $scope.signUpModal.hide();
       $state.go('app.home');
    },function (error) {           
          $rootScope.HideLoader(); 

          var message =error.data;
          if(error.data='Unauthorized')
            message = 'Either username or password is incorrect, please try again.';

          Alert('Error', message || 'Something went wrong, please try again.', function() {
            $scope.canReset=false;
         });
    });
  }



  $scope.showPopup = function() {
    $scope.user = {}

    Alert('Sorry!', 'Your account is being authorized, please try again soon.', function() {
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
          toolbar: 'yes',
          EnableViewPortScale : 'yes'
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

  $scope.EnterAddress = function() {
    $scope.addressModal.show();
  }

  $scope.CloseAddress = function() {  

    var a = '';
    $scope.NewUser.address.forEach(function(i){
    if(i == $scope.NewUser.address[0] ){
           a=i;
         }else{
           if(i!=='')
              a+= ', '+i; 
        }
    });

    if(a==='')
      $scope.address='Work Physical Address';
    else      
      $scope.address=a; 


    $scope.addressModal.hide();
  }

  $scope.EnterPostalAddress = function(){
    $scope.postalAddressModal.show();      
  }

  $scope.ClosePostalAddress = function(){

    var p = '';
    $scope.NewUser.postalAddress.forEach(function(i){
    if(i == $scope.NewUser.postalAddress[0] ){
          p=i;
        } else{

            if(i!=='')
              p+=  ', '+i; 
          
        }
    });

     
    if(p==='')
      $scope.postal='Work Postal Address';
    else      
       $scope.postal=p; 
  
    
    $scope.postalAddressModal.hide();

  }

  $scope.UpdatePostalAddress=function(value){
    if(value){
      $scope.NewUser.postalAddress[0] = $scope.NewUser.address[0];
      $scope.NewUser.postalAddress[1] = $scope.NewUser.address[1];
      $scope.NewUser.postalAddress[2] = $scope.NewUser.address[2];
      $scope.NewUser.postalAddress[3] = $scope.NewUser.address[3];
    }
    else{
      $scope.NewUser.postalAddress[0] = '';
      $scope.NewUser.postalAddress[1] = '';
      $scope.NewUser.postalAddress[2] = '';
      $scope.NewUser.postalAddress[3] = '';
    }
  }


  //$scope.$watch('');


  // This is a temporary hack for the issue with the bottom tabs

  if (!Platform.isWindowsPhone) {
    setInterval(function() {
      $('.bottomTab').removeClass('tab-item-active');
      $('.bottomTab.'+$state.params.type).addClass('tab-item-active');
    },200);
  };
  


    
  $rootScope.isActive = function(state) {
    if (state == $state.params.type) {
        return true;
    };
  }




   

  
});










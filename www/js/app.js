// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var KayApp = angular.module('starter', ['ionic', 'starter.controllers','starter.services','ngCordova','ionic.service.core','ionic.service.push'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicAppProvider) {
  // $ionicConfigProvider.views.swipeBackEnabled(false);

  $ionicAppProvider.identify({
    // The App ID for the server
    app_id: '38b920ae',
    // The API key all services will use for this app
    api_key: '9ad2c0b82a870b2d425434eab632c924a2df23e31b76f229'
    // Your GCM sender ID/project number (Uncomment if using GCM)
    //gcm_id: 'YOUR_GCM_ID'
  });

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider


  // MAIN CONTROLLER

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // HOME CONTROLLER

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  // REQUEST CONTROLLER

  .state('app.request', {
    url: "/request/:type",
    views: {
      'menuContent': {
        templateUrl: "templates/request.html",
        controller: 'RequestCtrl'
      }
    }
  })

  // PRODUCT INFO CONTROLLER

  .state('app.productinfo', {
    url: "/productinfo",
    views: {
      'menuContent': {
        templateUrl: "templates/product-info.html",
        controller: 'ProductCtrl'
      }
    }
  })

  // PRODUCT TYPE CONTROLLER

  .state('app.producttype', {
    url: "/productType/:type",
    views: {
      'menuContent': {
        templateUrl: "templates/product-type.html",
        controller: 'ProductCtrl'
      }
    }
  })

  // GAME CONTROLLER

  .state('app.game', {
    url: "/game",
    views: {
      'menuContent': {
        templateUrl: "templates/game.html",
        controller: 'GameCtrl'
      }
    }
  })

  // MEDIA CONTROLLER

  .state('app.media', {
    url: "/media",
    views: {
      'menuContent': {
        templateUrl: "templates/media.html",
        controller: 'MediaCtrl'
      }
    }
  })

  // FIND US CONTROLLER

  .state('app.findus', {
    url: "/findus",
    views: {
      'menuContent': {
        templateUrl: "templates/findus.html",
        controller: 'FindUsCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

;!(function ($) {
    $.fn.classes = function (callback) {
        var classes = [];
        $.each(this, function (i, v) {
            var splitClassName = v.className.split(/\s+/);
            for (var j in splitClassName) {
                var className = splitClassName[j];
                if (-1 === classes.indexOf(className)) {
                    classes.push(className);
                }
            }
        });
        if ('function' === typeof callback) {
            for (var i in classes) {
                callback(classes[i]);
            }
        }
        return classes;
    };
})(jQuery);

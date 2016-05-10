// Ionic Starter App

var firebaseUrl = "https://davids-app.firebaseio.com/";
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform, $rootScope,$firebaseObject, $location,$state, Auth, $ionicLoading) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }

            ionic.Platform.fullScreen();

            var ref = new Firebase(firebaseUrl);

            $rootScope.firebaseUrl = firebaseUrl;
            $rootScope.displayName = null;


            Auth.$onAuth(function (authData) {
            if (authData) {
                console.log("Logged in as:", authData.uid);
                $rootScope.currentUserID = authData.uid;
                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                  var val = snapshot.val();
                  // To Update AngularJS $scope either use $apply or $timeout
                    $rootScope.displayName = val.displayName;
                    console.log(  $rootScope.displayName);
                });
                $state.go('tab.activities');
            } else {
                console.log("Logged out");
                $ionicLoading.hide();
                $location.path('/login');
            }
        });
        $rootScope.logout = function () {
          console.log("Logging out from the app");
          $ionicLoading.show({
            template: 'Logging Out...'
          });
          Auth.$unauth();
        }

        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
          // We can catch the error thrown when the $requireAuth promise is rejected
          // and redirect the user back to the home page
          if (error === "AUTH_REQUIRED") {
            $location.path("/login");
          }
        });
      });
    })

    .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

      $ionicConfigProvider.tabs.position('bottom'); //bottom
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'MainCtrl',
                resolve: {
                  // controller will not be loaded until $waitForAuth resolves
                  // Auth refers to our $firebaseAuth wrapper in the example above
                  "currentAuth": ["Auth",
                  function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                  }]
                }
              })

            // Each tab has its own nav history stack:

            .state('tab.activities', {
                url: '/activities',
                views: {
                    'tab-activities': {
                        templateUrl: 'templates/tab-activities.html',
                        controller: 'ActivitiesCtrl'
                    }
                }
            })
            .state('room', {
                url: '/room/:roomId',
                templateUrl: 'templates/room.html',
                controller: 'RoomCtrl'
            })
            .state('room-user', {
                url: '/room/:roomId/:userId',
                templateUrl: 'templates/room.html',
                controller: 'RoomCtrl'
            })
            .state('room-group', {
                url: '/room/:roomId/:groupName/:userList',
                templateUrl: 'templates/room.html',
                controller: 'RoomCtrl'
            })

            .state('room-setting', {
                url: '/room-setting/:roomId',
                templateUrl: 'templates/room-setting.html',
                controller: 'RoomSettingCtrl'
            })

            .state('room-setting-user', {
                url: '/room-setting/:roomId/:userId',
                templateUrl: 'templates/room-setting.html',
                controller: 'RoomSettingCtrl'
            })
            .state('room-setting-group', {
                url: '/room-setting/:roomId/:groupName/:userList',
                templateUrl: 'templates/room-setting.html',
                controller: 'RoomSettingCtrl'
            })
            .state('user-setting', {
                url: '/user-setting/:userId',
                templateUrl: 'templates/user-setting.html',
                controller: 'UserSettingCtrl'
            })

            .state('tab.groups', {
                url: '/groups',
                views: {
                    'tab-groups': {
                        templateUrl: 'templates/tab-groups.html',
                        controller: 'GroupsCtrl'
                    }
                }
            })

            .state('tab.friends', {
                url: '/friends',
                abstract: true,
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('tab.friends.messenger', {
                url: '/messenger',

                        templateUrl: 'templates/tab-friends-messenger.html'

            })
            .state('tab.friends.active', {
                url: '/active',

                        templateUrl: 'templates/tab-friends-active.html'

            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })

            // All templates about user
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl',
                resolve: {
                  // controller will not be loaded until $waitForAuth resolves
                  // Auth refers to our $firebaseAuth wrapper in the example above
                  "currentAuth": ["Auth",
                  function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                  }]
                }
            })
            .state('sign-up', {
                url: '/sign-up',
                templateUrl: 'templates/sign-up.html',
                controller: 'signupCtrl',
                resolve: {
                  // controller will not be loaded until $waitForAuth resolves
                  // Auth refers to our $firebaseAuth wrapper in the example above
                  "currentAuth": ["Auth",
                  function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                  }]
                }
            })
            .state('sign-up-name', {
                url: '/sign-up-name',
                templateUrl: 'templates/sign-up-name.html'
            })
            .state('sign-up-photo', {
                url: '/sign-up-photo',
                templateUrl: 'templates/sign-up-photo.html'
            })
            .state('sign-up-success', {
                url: '/sign-up-success',
                templateUrl: 'templates/sign-up-success.html'
            })
            .state('forgot-password', {
                url: '/forgot-password',
                templateUrl: 'templates/forgot-password.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });

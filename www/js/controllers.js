var firebaseUrl = "https://davids-app.firebaseio.com/";
angular.module('starter.controllers', [])
    .controller('MainCtrl', function ($scope,$timeout, $stateParams, $rootScope,$ionicLoading,$firebaseObject,Auth,User, $ionicModal, Room, $location, $rootScope, $ionicPopup) {
        $scope.historyBack = function () {
            window.history.back();
        };
        $timeout(function() {
          console.log($rootScope.currentUserID);

          $scope.friends = User.myFriends($rootScope.currentUserID);
          $scope.activities = Room.userActivities($rootScope.currentUserID);

          // for tab-account and sign-up-success
          $scope.user = User.get($rootScope.currentUserID);
        }, 650);
        // for new-group
        $rootScope.newGroupName = '';
        $scope.createNewGroup = function (groupName) {
            var roomUserList = "";
            for (var i = 0; i < $scope.friends.length; i++)
                if ($scope.friends[i].checked) {
                    if (!roomUserList) {
                        roomUserList = $scope.friends[i].id;
                    }
                    else {
                        roomUserList += "+" + $scope.friends[i].id;
                    }
                }

            if (roomUserList.split("+").length < 2 || !groupName) {
                if (roomUserList.split("+").length < 2) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please Add More People',
                        template: 'Groups need at least three people.',
                        okType: 'button-clear'
                    });
                    return;
                }
                if (!groupName) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Name This Group',
                        template: 'To create the group, please name it first. (Anyone in the group can change the name later.)',
                        okType: 'button-clear'
                    });
                    return;
                }
            }
            else {
                roomUserList += "+213";
                $location.path("/room/new/" + groupName + "/" + roomUserList);
                $rootScope.newGroupName = '';
                for (var i = 0; i < $scope.friends.length; i++) {
                    $scope.friends[i].checked = '';
                }
            }

        }

        // new-chat modal
        $ionicModal.fromTemplateUrl('templates/modal/new-chat.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.newChatmodal = modal;
        });
        $scope.openNewChat = function () {
            $scope.newChatmodal.show();
        };
        $scope.closeNewChat = function () {
            $scope.newChatmodal.hide();
        };

        // new-group modal
        $ionicModal.fromTemplateUrl('templates/modal/new-group.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.newGroupModal = modal;
        });
        $scope.openNewGroup = function () {
            $scope.newGroupModal.show();

        };
        $scope.closeNewGroup = function () {
            $scope.newGroupModal.hide();
        };

        // add-people modal
        $ionicModal.fromTemplateUrl('templates/modal/add-people.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addPeopleModal = modal;
        });
        $scope.openAddPeople = function () {
            $scope.addPeopleModal.show();

        };
        $scope.closeAddPeople = function () {
            $scope.addPeopleModal.hide();
        };

        // search modal
        for (var i in $scope.friends) {
            var room = Room.getByUserId($scope.friends[i].id);

            $scope.friends[i].room = room;
        }

        $ionicModal.fromTemplateUrl('templates/modal/search.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.searchModal = modal;
        });
        $scope.openSearch = function () {
            $scope.searchModal.show();

        };
        $scope.closeSearch = function () {
            $scope.searchModal.hide();
        };

        $scope.clearSearch = function () {
            $scope.search = "";
        };

        $scope.$on('$stateChangeStart', function () {
            if ($scope.searchModal) {
                $scope.closeSearch();
                $scope.clearSearch();
            }
            if ($scope.addPeopleModal) {
                $scope.closeAddPeople();
            }
            if ($scope.newGroupModal) {
                $scope.closeNewGroup();
            }
            if ($scope.newChatmodal) {
                $scope.closeNewChat();
            }
        });
    })

    .controller('ActivitiesCtrl', function ($scope,$timeout,$rootScope, Room, User) {

      $timeout(function() {
    console.log($rootScope.displayName);
      $scope.eventTitle = $rootScope.displayName+ "s' Events";
      console.log($rootScope.currentUserID);
  }, 650);
      //console.log($rootScope.displayName);
        //$scope.eventTitle =  " Events";
        $scope.activities = Room.userActivities($rootScope.currentUserID);

        $scope.remove = function (item) {
            Room.remove(item);
        };

        $scope.friends = User;
    })

    .controller('RoomCtrl', function ($scope,$rootScope,$timeout, $stateParams, Room, Chat) {
      $timeout(function() {
      console.log($rootScope.currentUserID);
    }, 650);
        if ($stateParams.roomId == "new") {
            if ($stateParams.userList) {
                $scope.room = Room.newGroup($stateParams.groupName, $stateParams.userList);
                $scope.room.settingURL = "#/room-setting/new/" + $stateParams.groupName + "/" + $stateParams.userList;
            } else {
                $scope.room = Room.newRoom($stateParams.userId);
                $scope.room.settingURL = "#/room-setting/new/" + $stateParams.userId;
            }
        }
        else {
            $scope.room = Room.get($stateParams.roomId);
            $scope.room.settingURL = "#/room-setting/" + $stateParams.roomId;
        }

        $scope.chatList = Chat.getByRoom($scope.room.id);


        $scope.sendChat = function (chatText) {
            Chat.add(chatText, $stateParams.roomId,"");
            $scope.chatList = Chat.getByRoom($stateParams.roomId);
            reply();

        };

        var reply = function () {
            var userId;
            for (var i = 0; i < $scope.room.userList.length; i++) {
                if ($scope.room.userList[i] != $rootScope.currentUserID) {
                    userId = $scope.room.userList[i];
                }
            }
            var chatText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            Chat.add(chatText, $stateParams.roomId, userId);
            $scope.chatList = Chat.getByRoom($stateParams.roomId);
        };

    })

    .controller('GroupsCtrl', function ($scope, $rootScope,Room) {
        $scope.groupRow = Room.allGroups($rootScope.currentUserID, 2);
    })

    .controller('FriendsCtrl', function ($scope, $rootScope,$stateParams, $ionicPopup, User, Room, $state) {
        $scope.$state = $state;
        $scope.friends = User.myFriends($rootScope.currentUserID);


        for (var i in $scope.friends) {
            var room = Room.getByUserId($scope.friends[i].id);

            $scope.friends[i].room = room;
        }

        // add contact
        $scope.showPromptAdd = function () {
            $ionicPopup.prompt({
                    title: 'Add Contact',
                    template: 'Enter someone\'s email to find them on Messenger',
                    inputType: 'email',
                    inputPlaceholder: 'Email',
                    cancelType: 'button-clear',
                    okText: 'Save',
                    okType: 'button-clear'
                }
            ).
                then(function (res) {
                    console.log('Your password is', res);
                });
        }
    })

    .controller('AccountCtrl', function ($scope,$rootScope, $ionicActionSheet, $ionicModal, Auth) {
        //logout function
        $scope.logout = function() {
          Auth.$unauth();
        };

        $scope.showNotification = function () {

            $ionicActionSheet.show({
                buttons: [
                    { text: 'Turn off for 15min' },
                    { text: 'Turn off for 1h' },
                    { text: 'Turn off for 8h' },
                    { text: 'Turn off for 24h' }
                ],
                titleText: 'Notifications',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    return true;
                }
            });
        };

        $scope.showSync = function () {

            $ionicActionSheet.show({
                buttons: [
                    { text: 'Stop Syncing' }
                ],
                titleText: 'Stop syncing your phone contacts？',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    return true;
                }
            });
        };

        // edit modal
        $scope.showEdit = function () {

            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Change email' }
                ],
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.changeEmailmodal.show();
                        hideSheet();
                    }
                }
            });
        };

        // change email modal
        $ionicModal.fromTemplateUrl('templates/modal/change-email.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.changeEmailmodal = modal;
        });
        $scope.openChangeEmail = function () {
            $scope.changeEmailmodal.show();
        };
        $scope.closeChangeEmail = function () {
            $scope.changeEmailmodal.hide();
        };
    })

    .controller('RoomSettingCtrl', function ($scope, $rootScope,$ionicActionSheet, $stateParams, $ionicPopup, Room) {
        if ($stateParams.roomId == "new") {
            if ($stateParams.userList) {
                $scope.room = Room.newGroup($stateParams.groupName, $stateParams.userList);
            } else {
                $scope.room = Room.newRoom($stateParams.userId);
            }
        }
        else {
            $scope.room = Room.get($stateParams.roomId);
        }

        $scope.setNotification = function () {

            $ionicActionSheet.show({
                buttons: [
                    { text: 'Turn off for 15min' },
                    { text: 'Turn off for 1h' },
                    { text: 'Turn off for 8h' },
                    { text: 'Turn off for 24h' },
                    { text: 'Until I turn it back on' }
                ],
                titleText: 'Mute notification for this conversation',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function () {
                    return true;
                }
            });
        };

        // A confirm
        $scope.showConfirmLeave = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Leave Group?',
                template: 'This conversation will be archived, and you won\'t get any new message.',
                cancelText: 'Cancel',
                cancelType: 'button-clear',
                okText: 'Leave',
                okType: 'button-clear'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Leave');
                } else {
                    console.log('Stay');
                }
            });
        };
    })

    .controller('UserSettingCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, User) {
        $scope.user = User.get($stateParams.userId);

        // A confirm
        $scope.showConfirmRemove = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Remove This Person?',
                template: 'They won\'t be able to keep chatting with this group.',
                cancelText: 'Cancel',
                cancelType: 'button-clear',
                okText: 'Remove',
                okType: 'button-clear'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Remove');
                } else {
                    console.log('Keep');
                }
            });
        };
    })

    .controller("DisableCtrl", function($scope) {
        $scope.thetext = "";
        $scope.b1 = function() {
            console.log("B1");
        };
        $scope.b2 = function() {
            console.log("B2");
        };
    })

    .controller('loginCtrl', function ($scope, $firebaseAuth, $state,$rootScope, $ionicModal, Auth) {

      var ref = new Firebase($scope.firebaseUrl);
      //$scope.db = ref;
      $scope.user = {};

      //login with twitter
      $scope.authWithtwitter=function(){
        ref.authWithOAuthPopup("twitter", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            console.log(authData.twitter.displayName);
            ref.child("users").child(authData.uid).set({
              email: null,
              displayName: authData.twitter.displayName
            });
            $rootScope.currentUserID = authData.uid;
            $rootScope.displayName = authData.twitter.displayName;
            console.log($rootScope.displayName);
            $state.go("tab.activities");
          }
        })
      } // End of Auth with twitter

      // Authenticate With Facebook
      $scope.authWithFacebook = function() {
        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            console.log("Log in failed due to: ", error);
          }
          else {
            console.log("Logged in as" + authData.facebook.displayName);
            ref.child("users").child(authData.uid).set({
              email: null,
              displayName: authData.facebook.displayName
            });
            $rootScope.currentUserID = authData.uid;
            $rootScope.displayName = authData.facebook.displayName;
            console.log($rootScope.displayName);
            $state.go("tab.activities");
          }
        })
      } // End of loginFB

      // Custom login (email)
      $scope.authWithGoogle = function(){
        ref.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            console.log(authData.google.displayName);
            ref.child("users").child(authData.uid).set({
              email: null,
              displayName: authData.google.displayName
            });
            $rootScope.currentUserID = authData.uid;
            $rootScope.displayName = authData.google.displayName;
            console.log($rootScope.displayName);
            $state.go("tab.activities");
          }
        });
      };

      // Email Login
      $scope.login = function(user) {
        // console.log(user);
        Auth.$authWithPassword({
          email: user.email,
          password: user.pass
        }).then(function(authData) {
          console.log(authData);
          console.log('Logged in successfully as: ', authData.uid);
          $rootScope.currentUserID = authData.uid;
          ref.child("users").child(authData.uid).once('value', function (snapshot) {
            var val = snapshot.val();
            // To Update AngularJS $scope either use $apply or $timeout
            $scope.$apply(function () {
              $rootScope.displayName = val.displayName;
              console.log(  $rootScope.displayName);
            });
          });
          $state.go("tab.activities");
        //  $scope.loggedInUser = authData;
        }).catch(function(error) {
          console.log('Error: ', error);
        });
      };

      })

      .controller('signupCtrl', function ($scope,$ionicLoading,$state, $rootScope, $ionicModal, Auth) {

        var ref = new Firebase($scope.firebaseUrl);
        $scope.user = {};
        $rootScope.createUser = function(user) {
          if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
              template: 'Signing Up...'
            });

            Auth.$createUser({
              email: user.email,
              password: user.password
            }).then(function (userData) {
              console.log(userData);
              alert("User created successfully!");
              Auth.$authWithPassword({
                email: user.email,
                password: user.password
              }).then(function(authData) {
                console.log(authData);
                console.log('Logged in successfully as: ', authData.uid);
                ref.child("users").child(userData.uid).set({
                  email: user.email,
                  displayName: user.displayname
                });
                $rootScope.currentUserID = authData.uid;
                $rootScope.displayName = user.displayname;
              }).catch(function(error) {
                console.log('Error: ', error);
              });
              $ionicLoading.hide();
              $state.go('tab.activities');
            }).catch(function (error) {
              alert("Error: " + error);
              $ionicLoading.hide();
            });
          } else
          alert("Please fill all details");
        };


      });

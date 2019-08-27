angular.module('app.controllers')

.controller('feedCtrl', function($scope, $state, S2gApi, UserService, $rootScope, defaultImages, GAService) {
  'use strict';

  GAService.TrackPageVisited("Inbox");
  
  $rootScope.$viewHistory.backView = null;

  $scope.items = {};
  $scope.requests = [];
  $scope.users = {};
  $scope.contentLoaded = false;
  
  $scope.toggleMenuButton(true);

  // Get user information
  // TEMP WE are setting this when we create the profile but this is here to capture for users that had previously created their profile
  if (!UserService.userData || !UserService.userData.avatar) {
    $scope.getUserData( function (err, response) {
      if (response) {
        $scope.currentUser = UserService.userData;
      }
    });
  } else {
    $scope.currentUser = UserService.userData;
  }
  
  $scope.getInbox = function(){
    S2gApi
      .getInbox(UserService.username, UserService.token)
      .then( 
        function (response) {
          $scope.replies = response.data;
          $scope.contentLoaded=true;
          $scope.$broadcast('scroll.refreshComplete');         
        },
        function (reason) {
          console.log(reason);
        });
   }
  $scope.getInbox();


  $scope.showConversation = function(replyId, itemId, shoutoutId){
    var objectId;
    var objectType;
    if (itemId) {
       GAService.TrackPageAction('Inbox','Request Tapped','root');
       objectId = itemId;
       objectType = "item";
    } else if (shoutoutId) {
        GAService.TrackPageAction('Inbox','Shoutout Tapped','root');
        objectId = shoutoutId;
       objectType = "shoutout";
    }
    $scope.toggleMenuButton(false);
      setTimeout(function () {
        $state.go('main.conversation', { replyId: replyId, itemId: objectId, type: objectType });
      }, 200);
  }

  $scope.noAvatar = function(gender) {
    if (gender === "female") {
      return defaultImages.female;
    } else {
      return defaultImages.male;
    }
  }

  //not hooked up
  
  $scope.removeRequest = function (request) {
    S2gApi
      .removeFeedRequest(UserService.username, UserService.token, request.id)
      .then(
        function (response) {
          var index = 0;
          while (index < $scope.requests.length) {
            if ($scope.requests[index].id === request.id) {
              $scope.requests.splice(index, 1);
              //console.log('Request removed from feed: ' + JSON.stringify(request));
            }
            index++;
          }
          console.log(response);
        },
        function (reason) {
          console.log(reason);
        });
  };

});

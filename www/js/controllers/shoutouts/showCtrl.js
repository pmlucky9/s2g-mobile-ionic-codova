angular.module('app.controllers')

.controller('shoutouts.showCtrl', function($scope, $state, S2gApi, UserService, $stateParams, $ionicNavBarDelegate, $ionicPopup, $filter, $ionicViewService, neighborhoodSince, defaultImages, GAService) {
  'use strict';

  GAService.TrackPageVisited("Request Detail", "Detail");

  //  $scope.toggleMenuButton(false);
  $scope.shoutout = {};
  $scope.request = {};
  $scope.users = {};
 
  $scope.currentUser = UserService.userData;
  $scope.myItem = false;
  $scope.contentLoaded = false;
  $scope.hasReplied = false;

  // Get shoutout from API
  $scope.getShoutouts = function(){
  S2gApi
    .getNeighborhoodShoutout(UserService.token, UserService.neighborhood, $stateParams.id)
    .then(
      function (response) {
        $scope.shoutout = response.data.shoutout;
        $scope.replies = response.data.requests;
        $scope.users = response.data.users;
        // Shoutout borrower
        $scope.neighbor = $scope.users[$scope.shoutout.borrower];
        $scope.neighbor.username = $scope.neighbor.firstName + ' ' + $filter('limitTo')($scope.neighbor.lastName, 1) + '.'
        $scope.contentLoaded=true;
        $scope.myItem = ($scope.shoutout.borrower == UserService.userId);
        $scope.hasReplied = (!$scope.myItem && $scope.replies.length > 0);     
      },
      function (reason) {
        console.log(reason);
      });
  }

  // Get shoutout from API
  $scope.updateReplies = function(){
  S2gApi
    .getNeighborhoodShoutout(UserService.token, UserService.neighborhood, $stateParams.id)
    .then(
      function (response) {
        $scope.replies = response.data.requests;
        $scope.hasReplied = true;
      },
      function (reason) {
        console.log(reason);
      });
  }
  $scope.getShoutouts();

  $scope.inYears = function(date){
   //function defined in services/global.js
   return neighborhoodSince.inYears(date);
 } 
 //REPLY FUNCTIONS
 $scope.showConversation = function (replyId, itemId) {
    $scope.toggleMenuButton(false);
    setTimeout(function () {
      $state.go('main.conversation', { replyId: replyId, itemId: itemId, type: 'shoutou' });
    }, 200);  
  };

  $scope.noAvatar = function(gender) {
  if (gender === "female") {
    return defaultImages.female;
    } else {
    return defaultImages.male;
    }
  }

  $scope.lendPopup = function(username, item){
    $ionicPopup.show({	
    	template:'<textarea autofocus placeholder="Start the conversation about lending this item" rows="3" ng-model="request.text"></textarea>',
    	title:"Tell " + $scope.neighbor.username + " that you can help with this request",
      scope: $scope,
    	buttons: [
      {
        text: 'Cancel',
        type:'button-small button-positive'
      },{
        text:'Send',
    		type:'button-small button-positive',
    		onTap: function(e){   		 	
    		 	if (!$scope.request.text) {
            e.preventDefault();
          } else {
            GAService.TrackPageAction('Request Detail','Send Tapped','detail');
            $scope.request.type = 'borrow-request';
            S2gApi
              .saveShoutoutRequest( $scope.shoutout, $scope.request, UserService.token)
              .then(
                function (response) {
                  $scope.updateReplies();
                  console.log('Response sent');
                },
                function (reason) {
                  console.log(reason);
                });
      		}	
        }
  		}
  		]
    });
  };



$scope.editShoutout = function(){
    if ($scope.myItem) {
      $state.go('main.shoutout-edit', { id: $stateParams.id });
    }
  }

 

});

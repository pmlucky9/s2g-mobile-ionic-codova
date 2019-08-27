angular.module('app.controllers')

.controller('conversation.conversationCtrl', ['$scope', '$state', 'S2gApi', 'UserService', '$stateParams', '$ionicScrollDelegate', '$filter', 'neighborhoodSince', 'locationService', 'defaultImages', 'GAService', function($scope, $state, S2gApi, UserService, $stateParams, $ionicScrollDelegate, $filter, neighborhoodSince, locationService, defaultImages, GAService) {

  'use strict';

  GAService.TrackPageVisited("Conversation", "detail");

  $scope.item = {};
  $scope.newMessage = "";
  $scope.distance = '';
  
  var currentUser = $scope.currentUser = UserService.userData;
  var neighbor;
  
  //variables used to track state/type of data
  $scope.data = {
    itemType : $stateParams.type,
    itemLoaded : false,
    convoLoaded : false,
    isItem : false,
    isShoutout : false,
    myItem : false,
    messageLoading : false
  }
  
  
  $scope.getItem = function(){
  S2gApi
    .getItem( $stateParams.itemId, UserService.token )
    .then(
      function (response) {
        $scope.item = response.data.item;
        $scope.data.myItem = ($scope.item.lender == UserService.userId);
        $scope.data.itemLoaded = true;
        $scope.getConversation();     
      },
      function (reason) {
        console.log(reason);
      });
  };
  $scope.getShoutout = function(){
  S2gApi
    .getNeighborhoodShoutout( UserService.token, UserService.neighborhood, $stateParams.itemId )
    .then(
      function (response) {
        $scope.item = response.data.shoutout;
        $scope.data.itemLoaded = true; 
        $scope.getConversation();   
      },
      function (reason) {
        console.log(reason);
      });
  };
 if ($scope.data.itemType == 'item'){
    $scope.data.isItem = true;
    $scope.getItem();
  } else {
    $scope.data.isShoutout = true;
    $scope.getShoutout();
  }
  
  $scope.getConversation = function(){
  S2gApi
    .getConversation( UserService.token, $stateParams.replyId)
    .then(
      function (response) {
        $scope.conversation = response.data; 
        $scope.data.convoLoaded = true; 
        //make it easier to parse in the ui
        if ($scope.data.isItem) {
          if ($scope.conversation.lender.id == UserService.userId) {
            $scope.data.myItem = true;
            $scope.showNeighbor = true;
          } else {
            $scope.data.myItem = false;
            $scope.showNeighbor = $scope.conversation.lenderMessages >0;
          }
          $scope.me = ($scope.data.myItem) ? $scope.conversation.lender : $scope.conversation.borrower;
          $scope.neighbor = ($scope.data.myItem) ? $scope.conversation.borrower : $scope.conversation.lender;
        } else if ($scope.data.isShoutout) {
          if ($scope.conversation.borrower.id == UserService.userId) {
            $scope.data.myItem = true;
          }
          $scope.me = ($scope.data.myItem) ? $scope.conversation.borrower : $scope.conversation.lender;
          $scope.neighbor = ($scope.data.myItem) ? $scope.conversation.lender : $scope.conversation.borrower;
          $scope.showNeighbor = true;
        }
        $scope.neighbor.username = $scope.neighbor.firstName + ' ' + $filter('limitTo')($scope.neighbor.lastName, 1) + '.'
        $scope.$broadcast('scroll.refreshComplete'); 
        $ionicScrollDelegate.$getByHandle('convoScroll').scrollBottom();         
      },
      function (reason) {
        console.log("convo error", reason);
      });
  }

  $scope.noAvatar = function(gender) {
  if (gender === "female") {
    return defaultImages.female;
    } else {
    return defaultImages.male;
    }
  }
  
  //$scope.getConversation();
  $scope.showItem = function (itemType, itemId) {
    $scope.toggleMenuButton(false);
    if (itemType == "item"){
    setTimeout(function () {
      $state.go('main.item', {id: itemId});
    }, 200);
  } else {
    setTimeout(function () {
      $state.go('main.shoutout', { id: itemId });
    }, 200);
  }
  };

  $scope.sendMessage = function() {
    if ($scope.newMessage){
      $scope.data.messageLoading = true;
      var message = {};
      message.subject = ($scope.item.title) ? 'Re: ' + $scope.item.title : 'Re:' + $scope.item.name;
      message.content = $scope.newMessage;
      $scope.newMessage = "";
      S2gApi
      .postMessage( UserService.token, $stateParams.replyId, message)
      .then(
        function (response) {
          $scope.data.messageLoading = false;
          $scope.getConversation();     
        },
        function (reason) {
          $scope.data.messageLoading = false;
          console.log("message error", reason);
        });
    }
  } 
}]);

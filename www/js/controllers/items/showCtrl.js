angular.module('app.controllers')

.controller('items.showCtrl', ['$scope', '$state', 'S2gApi', 'UserService', '$stateParams', '$ionicNavBarDelegate', '$ionicPopup', '$ionicModal', 'defaultImages', 'itemCache', 'GAService', function($scope, $state, S2gApi, UserService, $stateParams, $ionicNavBarDelegate, $ionicPopup, $ionicModal, defaultImages, itemCache, GAService) {
  'use strict';

  GAService.TrackPageVisited("Product Detail", "detail");

  // $ionicNavBarDelegate.showBackButton(true);
  // $scope.toggleMenuButton(false);
  $scope.contentLoaded = false;
  $scope.editLoaded = false;
  $scope.item = {};
  $scope.replies = [];
  $scope.response = {};
  
  var viewState = 'show';
  var uploadingPhoto = false;

  $scope.myItem = false;

  $scope.currentUser = UserService;

  var completeLoad = function(){
    $scope.myItem = ($scope.item.lender == UserService.userId);
    $scope.hasReplied = (!$scope.myItem && $scope.replies.length > 0);
    $scope.contentLoaded = true;
    $scope.editLoaded = true;   
  };

   $scope.updateReplies = function(){
    S2gApi
    .getItem( $stateParams.id, UserService.token )
    .then(
      function (response) {
        $scope.replies = response.data.requests; 
        $scope.users = response.data.users; 
        $scope.hasReplied = true;     
      },
      function (reason) {
        console.log(reason);
      });
  }

  $scope.getItem = function(){
    //item may be stored in Cache if we came from edit state;
    var thisItem = itemCache.get('current');
    //if it does not exist or does not match current id - we fetch it
    if (!thisItem || thisItem.item.id !== $stateParams.id){ 
      S2gApi
      .getItem( $stateParams.id, UserService.token )
      .then(
        function (response) {
          $scope.item = response.data.item;
          $scope.replies = response.data.requests;
          $scope.users = response.data.users;
          completeLoad();             
        },
        function (reason) {
          console.log("error", reason.status, reason);
          //with cacheing its possible that an item appears in the gallery if it was recently deleted.
          //we clear the cache to ensure a refresh when they go back or click browse.
          $scope.missingItem = true;
          $scope.item.type = "Uh-oh";
          itemCache.remove('mine');
          itemCache.remove('all');
        });
    } else {
      $scope.item = thisItem.item;
      $scope.users = thisItem.users;
      $scope.replies = thisItem.replies;
      completeLoad();
      $scope.updateReplies();
    }
  }
  
  $scope.getItem();
 
  $scope.editItem = function (itemId) {
    var c = {};
    c.item = $scope.item;
    c.users = $scope.users;
    c.replies = $scope.replies;
    itemCache.put('current', c); 
    $state.go('main.item-edit', { id: itemId });      
    viewState = 'edit'; 
    $scope.$broadcast('loadEditForm');
  };  

  //---------REPLY FUNCTIONS ----------
  $scope.showConversation = function (replyId, itemId) {
    $scope.toggleMenuButton(false);
    setTimeout(function () {
      $state.go('main.conversation', { replyId: replyId, itemId: itemId, type: 'item' });
    }, 200);  
  };

  $scope.noAvatar = function(gender) {
  if (gender === "female") {
    return defaultImages.female;
    } else {
    return defaultImages.male;
    }
  }

  $scope.replyPopup = function(){
    var placeholderText = "Howdy Neighbor! I could use this. Is it still available?"
    $ionicPopup.show({  
      template:'<textarea special-input autofocus placeholder=\'' + placeholderText +'\' on-return="updateReplies()" rows="3" ng-model="response.text"></textarea>',
      title:"Communicate with your Neighbor",
      scope: $scope,
      buttons: [
      {
        text: 'Cancel',
        type:'button-small button-positive'
      },{
        text:'Send',
        type:'button-small button-positive',
        onTap: function(e){
          if (!$scope.response.text) {
            $scope.response.text = placeholderText;
          }

          $scope.response.type = 'borrow-request';
          S2gApi
            .saveItemRequest( $scope.response, UserService.token, $scope.item.id)
            .then(
              function (response) {
                $scope.updateReplies();
              },
              function (reason) {
                console.log(reason);
              });

        } 
      }
      ]
    });
  };
    
 

}]);

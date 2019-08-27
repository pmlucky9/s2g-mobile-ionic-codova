angular.module('app.controllers')

.controller('shoutouts.editCtrl', function($scope, $state, S2gApi, UserService, $stateParams, $ionicNavBarDelegate, $ionicViewService, $ionicPopup, GAService) {
  'use strict';

  GAService.TrackPageVisited("Edit Request Detail", "edit");

  //  $scope.toggleMenuButton(false);
  $scope.item = {};
  $scope.currentUser = UserService;
  $scope.data = {
    editItem : true,
    itemSubmitted : false,
    isSaving : false
  }


//used on cancel
  $scope.goBack = function() {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
  };

  // Get shoutout from API
  $scope.getShoutout = function(){
  S2gApi
    .getNeighborhoodShoutout(UserService.token, UserService.neighborhood, $stateParams.id)
    .then(
      function (response) {
        $scope.item = response.data.shoutout;
        },
      function (reason) {
        console.log(reason);
      });
  }

  $scope.getShoutout();

  $scope.deleteShoutoutPopup = function(){
    $ionicPopup.show({  
      template:'<div>Are you sure you want to delete this request? Any associated messages will also be deleted</div>',
      title:"Delete Request",
      scope: $scope,
      buttons: [{
        text:'Delete',
        type:'button-small button-positive',
        onTap: function(e){         
            $scope.deleteShoutout();
        }
      },
      {
        text: 'Cancel',
        type:'button-small button-positive'
      }]
    });
  };

  $scope.deleteShoutout = function(){
    S2gApi
      .removeNeighborhoodShoutout($scope.item.id, UserService)
      .then(
        function (response) {
          $state.go('main.shoutouts', { type: 'mine' });
        },
        function (reason) {
          console.log(reason);
        });
  }

 

  $scope.saveShoutout = function(isValid){
    if (isValid){
    $scope.data.isSaving = true;
    S2gApi
      .updateNeighborhoodShoutout($scope.item, UserService.token)
      .then( 
        function (response) { 
          $scope.data.itemSubmitted = false;
          $state.go('main.shoutouts', { type: 'mine' });       
        }, 
        function (reason) {
          console.log("shoutout error", reason);
          $scope.data.isSaving = false;
          $ionicPopup.alert({
             title: 'Uh-oh',
             template: 'There was an error saving this request, please try again later.'
           });
        });
      } else {
        $scope.data.itemSubmitted = true;
      }
  }


});

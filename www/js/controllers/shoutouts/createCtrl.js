angular.module('app.controllers')

.controller('shoutouts.createCtrl', function($scope, $state, S2gApi, UserService, $stateParams, $ionicNavBarDelegate, $ionicViewService, $ionicPopup) {
  'use strict';

  $scope.item = {};
  $scope.item.type = 'product';
  $scope.currentUser = UserService;
  $scope.data = {
    editItem : false,
    itemSubmitted : false,
    isSaving : false
  }

  //used on cancel
  $scope.goBack = function() {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
  };


  $scope.saveShoutout = function(isValid){
    $scope.item.neighborhood = $scope.currentUser.neighborhood;
    if (isValid){
    $scope.data.isSaving = true;
    S2gApi
      .saveNeighborhoodShoutout($scope.item, UserService.token)
      .then( 
        function (response) { 
          $state.go('main.shoutouts', { type: 'mine' }, {reload: true}); 
          $scope.closeShoutoutModal();

        }, 
        function (reason) {
          $scope.data.isSaving = false;
          $ionicPopup.alert({
             title: 'Uh-oh',
             template: 'There was an error saving this request, please try again later.'
           });
          console.log("shoutout error", reason);
      });
    } else {
        $scope.data.itemSubmitted = true;
    }
  }


});

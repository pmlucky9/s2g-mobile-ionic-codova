angular.module('app.controllers')

.controller('shoutouts.indexCtrl', function($scope, $state, S2gApi, UserService, $stateParams, defaultImages, GAService) {
  'use strict';

  $scope.toggleMenuButton(true);
  $scope.contentLoaded=false;
  var viewType = $scope.viewType = $stateParams.type; //if my shoutouts type=mine
  if (viewType === 'mine') {
    $scope.wouldYouType = 'borrow';
    GAService.TrackPageVisited("My Requests");
  } else {
    $scope.wouldYouType = 'lend';
    GAService.TrackPageVisited("Lend");
  }

  $scope.pageTitle = (viewType === "mine") ? "My Requests" : "Lend";
  $scope.currentUser = UserService.userData;
  

  $scope.refreshShoutouts = function(view){
    if (viewType === "mine"){
      $scope.getMyShoutouts();
    } else {
      $scope.getShoutouts();
    }
  }

  $scope.getShoutouts = function(){
    S2gApi.getNeighborhoodShoutouts(UserService.neighborhood, UserService.token)
      .then( function (response) {
        $scope.shoutouts = response.data.shoutouts;
        // Object containing requesters' information
        $scope.users = response.data.users;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.contentLoaded = true;
      }, function (error) {
        console.log("getRequestsError", error);
      }); 
  };

  $scope.getMyShoutouts = function(){
    S2gApi.getMyRequests(UserService.username, UserService.token)
      .then( function (response) {
        $scope.shoutouts = response.data.shoutouts;
        // To be changed to replies
        $scope.requests = response.data.requests;
        $scope.items = response.data.items;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.contentLoaded = true;
      }, function (error) {
        console.log("getRequestsError", error);
      }); 
  }

  
  if (viewType === 'mine'){
    $scope.getMyShoutouts();
  } else {
    $scope.getShoutouts();
  }

  $scope.noAvatar = function(gender) {
  if (gender === "female") {
    return defaultImages.female;
    } else {
    return defaultImages.male;
    }
  }
  $scope.showShoutout = function (shoutoutId) {  
    $scope.toggleMenuButton(false);
    setTimeout(function () {
      $state.go('main.shoutout', { id: shoutoutId });
    }, 200);
  };

});

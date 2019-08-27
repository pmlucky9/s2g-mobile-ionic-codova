angular.module('app.controllers')

// Controller for the left-menu button
.controller('EditCategoriesCtrl', function($scope, $filter, $state, $ionicModal, S2gApi, UserService, GAService) {
  'use strict';

  GAService.TrackPageVisited("Lending Categories", "edit");

  // Get MyNeighbor categories
  $scope.getCategories = function() {
    S2gApi.getCategories().then(
      function(response) {
        $scope.categories = response.data;
      },
      function(reason) {
        // TODO Need to handle error
        console.log(reason);
      });
  };
  // Get user's preferred categories
  $scope.getPrefCategories = function() {
    S2gApi.getPrefCategories(UserService).then(
      function(response) {
        $scope.selectedCategories = response.data;
      },
      function(reason) {
        // TODO Need to handle error
        console.log(reason);
      });
  };
  // Listen for broadcast called on opening modal
  $scope.$on('loadCategories', function(){
    $scope.categories = [];
    $scope.selectedCategories = [];
    $scope.getCategories();
    $scope.getPrefCategories();
  });

  $scope.selectCategory = function(catIndex) {
  	var index=$scope.selectedCategories.indexOf($scope.categories[catIndex]);
    if (index == -1){
      $scope.selectedCategories.push($scope.categories[catIndex]);
    } else {
      $scope.selectedCategories.splice(index,1); 
    }
  };
  // save preferences categories
  $scope.saveCategories = function() {
    S2gApi.savePrefCategories({
      username: UserService.username,
      token: UserService.token,
      categories: $scope.selectedCategories
    }).then(
      function(response) {
        console.log("save", response)
        $scope.$parent.closeCategories();
      },
      function(reason) {
        // TODO Handle error case
        console.log(reason);
      });
  };
});



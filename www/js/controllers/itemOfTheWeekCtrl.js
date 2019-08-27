angular.module('app.controllers')

.controller('itemOfTheWeekCtrl', function($scope, $state, S2gApi, UserService, $stateParams) {
  'use strict';

  // $scope.items = S2gApi.getItemsOfTheWeek(UserService.username, UserService.token)
    // .then( function () {
    // }, function (error) {
      // console.log(error);
    // });

  $scope.items = fixtureRequests2;

  $scope.showItem = function (item) {
    $state.go('main.borrow-item', {id: item.id});
  };

});
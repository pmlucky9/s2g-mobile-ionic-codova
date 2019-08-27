angular.module('app.controllers')

// Controller for the left-menu button
.controller('InviteNeighborsCtrl', function($scope) {
  'use strict';

  $scope.invite = function () {
    $scope.closeInviteNeighborsModal();
  };

  $scope.cancel = function () {
    $scope.closeInviteNeighborsModal();
  };

});
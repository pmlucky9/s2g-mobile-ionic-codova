angular.module('app.controllers')
.controller('errorCtrl', function($scope, $state, S2gApi, $stateParams) {
  'use strict';
  
  $scope.errorType = $stateParams.type;
  
  $scope.sendErrorDetails = function(){
    var error = {};
    error.contact = $scope.user.email;
    error.type = $scope.errorType;
    error.entry = $scope.entry.address;
    console.log("sendError", error);
    //TODO SEND ERROR TO SERVER;
    $state.go('intro');
  }
})
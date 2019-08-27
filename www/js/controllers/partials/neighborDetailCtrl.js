angular.module('app.controllers')

.controller('neighborDetailCtrl', ['$scope', '$filter', 'UserService', 'neighborhoodSince', 'locationService',
  function($scope, $filter, UserService, neighborhoodSince, locationService) {
    'use strict';

$scope.inYears = function(date){
     //function defined in services/global.js
     return neighborhoodSince.inYears(date);
   } 

$scope.getDistance = function() {
    var neighbor = $scope.neighbor;
    var currentUser = $scope.currentUser;
    $scope.locA = "";
    $scope.locB = "";
    var assignLocB = function() {
      if (neighbor.location) {
        $scope.locB = neighbor.location;
        calcDistance();
      } else {
        $scope.distance = 'n/a';
      };
    }
    
    var calcDistance = function(){
      var dist = locationService.getDistance($scope.locA, $scope.locB);
      $scope.distance = $filter('number')(dist, 1) + ' mi.';
    }

    if(currentUser.location){
      $scope.locA = currentUser.location;
      assignLocB();
    } else {
      $scope.distance = 'n/a';
    };
    
  }
$scope.$watch('neighbor', function() {
   $scope.getDistance();
});
 
}
]);
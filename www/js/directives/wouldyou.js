angular.module('app.directives')
  .controller('wouldYouTileCtrl', function ($scope, $state) {
    $scope.logo = "http://cdn2.business2community.com/wp-content/uploads/2013/10/neighborhood.jpg.jpg";
    
    $scope.wouldYou = function () {
      $scope.$broadcast('loadWouldYou');
      $state.go('wouldyou', { type: $scope.wouldYouType });
    };
  })

  .directive("wouldYouTile", function () {
    return {
      controller: 'wouldYouTileCtrl',
      restrict: "E",
      templateUrl: "/templates/partials/would-you-tile.html"
    };
  })

  .directive('wouldYouCard', function () {
    return {
      controller: 'wouldYouTileCtrl',
      restrict: "E",
      templateUrl: "/templates/partials/would-you-card.html"
    };
  });
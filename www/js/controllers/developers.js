angular.module('app.controllers')

.controller('developerCtrl', function($scope, $state, S2gApi, UserService, $rootScope, WouldYouStorage) {
  // Clear would you session saved in Local Storage
  $scope.clearWouldYouSession = function () {
    console.log('Clearing wouldyou session');
    WouldYouStorage.remove();
  };

  // Clear would you questions in DB
  $scope.clearWouldYouQuestions = function () {
    console.log('Clearing wouldyou questions in DB');
    WouldYouStorage.remove();
    S2gApi
      .clearWouldYouQuestions(UserService)
      .then(
        function (response) {
          console.log(response);
        },
        function (reason) {
          console.log(reason);
        });
  };
});
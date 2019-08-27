angular.module('app.controllers')

// Controller for the left-menu button
.controller('LoginModalCtrl', function($scope, $ionicSideMenuDelegate, UserService, S2gApi) {
  'use strict';

  $scope.login = function (user) {
    UserService.username = user.email;
    UserService.password = user.password;
    S2gApi.getAuthToken(UserService.username, UserService.password).then(
      function (data) {
        UserService.token = data;
        $scope.getUserData( function (err, response) {
          if (response) {
            console.log("Successfully fetched user data");
          }
        });
        $scope.closeLoginModal();
      },
      function (error) {
        console.log(error);
      }
    );
  };
});

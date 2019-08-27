angular.module('app.controllers')

.controller('profile.showCtrl', ['$scope', '$state', 'S2gApi', 'UserService', '$stateParams', '$ionicModal', 'neighborhoodSince', 'defaultImages', 'GAService', 
  function($scope, $state, S2gApi, UserService, $stateParams, $ionicModal, neighborhoodSince, defaultImages, GAService) {
    'use strict';

    GAService.TrackPageVisited("Profile");

    $scope.newProfile = false;

    console.log('User', UserService);

    $scope.getUserData = function() {
      if (!UserService.userData || !UserService.userData.address) {
        console.log('getting user by name');
        S2gApi
          .getUserByName(UserService.username, UserService.token)
          .then( function (response) {
            console.log('getting user neighborhood name');
            UserService.userData = response;
            $scope.user = UserService.userData;
            return S2gApi.getNeighborhoodName($scope.user.neighborhood, UserService.token);
          })
          .then( function (response) {
            console.log('setting the neighborhood name');
            UserService.neighborhoodObj.name = response.name;
            $scope.neighborhood = response.name;
          })
          .catch( function (error) {
            console.log( 'Error resolving data for the profile page: ', error);
          });
      } else {
        console.log( 'turns out we have data alread');
        $scope.user = UserService.userData;
      }

      // Account data is present, but not neighborhood data.
      if ($scope.user && $scope.user.neighborhood && (!UserService.neighborhoodObj || !UserService.neighborhoodObj.name)) {
        console.log ('we have data about the user but not the neighborhood details...');
        S2gApi.getNeighborhoodName($scope.user.neighborhood, UserService.token)
          .then(function(data) {
            UserService.neighborhoodObj.name = data.name;
            $scope.neighborhood = data.name;
          }, function(error) {
            console.log(error);
          });
      } else {
        $scope.neighborhood = UserService.neighborhoodObj.name;
      }
    };

    $scope.noAvatar = function(gender) {
      if (gender === 'female') {
        return defaultImages.female;
      } else {
        return defaultImages.male;
      }
    };

    $scope.getPreferences = function() {
      S2gApi.getPreferences(UserService)
        .then(function(response) {
          $scope.preferences = response.data;
          $scope.prefLoaded = true;
        }, function(error) {
          console.log(error);
        });
    };

    console.log ('about to get user data and preferences');
    $scope.getUserData();
    $scope.getPreferences();

    $scope.inYears = function(date) {
      //function defined in services/global.js
      return neighborhoodSince.inYears(date);
    };

    //-- EDIT 
    $scope.editProfile = function(user) {
      console.log('3', UserService);
      $scope.toggleMenuButton(false);
      setTimeout(function() {
        $state.go('main.profile-edit', {
          type: 'edit'
        });
        $scope.user = user;
      }, 200);
    };

    // //-- MANAGE CATEGORY PREFERENCES 
    $ionicModal.fromTemplateUrl('templates/edit-categories-modal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.editCategoriesModal = modal;
    });

    $scope.openCategories = function() {
      GAService.TrackPageVisited("Lending Categories", "edit");
      $scope.$broadcast('loadCategories');
      $scope.editCategoriesModal.show();
    };

    $scope.closeCategories = function() {
      console.log('close categories');
      $scope.editCategoriesModal.hide();
    };

  }
]);
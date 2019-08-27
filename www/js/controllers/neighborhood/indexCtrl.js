angular.module('app.controllers')

.controller('neighborhood.indexCtrl', function($scope, $state, S2gApi, UserService, $stateParams, $ionicSlideBoxDelegate, $google, locationService, defaultImages, GAService) {
  'use strict';

  GAService.TrackPageVisited("Neighborhood");
  $scope.toggleMenuButton(true);
  $scope.avatars = defaultImages;
  $scope.user = UserService.userData;
  $scope.data = {
    isLoaded : false
  }
  
  $scope.resizebutton = "Expand Map";
  $scope.resizeMap = function(){
    if ($scope.fullscreen === true){
      $scope.fullscreen = false;
      $scope.resizebutton = "Expand Map";
    } else {
      $scope.fullscreen = true;
      $scope.resizebutton = "Minimize Map";
    };
  }
  $scope.getGeojson = function(){
  var lat = $scope.user.location.lat;
  var lng = $scope.user.location.lng;   
  var latLng = '@' + lat + ',' + lng;
  S2gApi.getNeighborhoodatLocation( latLng )
    .then( function (data) {
        $scope.fullscreen = false;
        if(data.geojson) {
          $scope.geojson = data.geojson;           
        }
        $scope.data.isLoaded = true;
    }, function (error) {
      console.log("Error" + error);
    });
  };
  $scope.getGeojson();

  S2gApi.getNeighborhoodTopUsers(UserService.neighborhood, UserService.token)
    .then(function (data) {
      console.log("neighbors : ", data.neighbors);
      if(data.neighbors.length == 0)
        $scope.users = fixtureUsers.slice(0,3);
      else
        $scope.users = data.neighbors;
      $ionicSlideBoxDelegate.update();       
  }, function (error) {
    console.log("Error: " + error);
  });

  S2gApi.getNeighborhoodTopItems(UserService.neighborhood, UserService.token)
    .then(function (data) {
      console.log("items : ", data.items);
      if(data.items.length == 0)
        $scope.items = fixtureItems.slice(0,3);
      else
        $scope.items = data.items;      
      $ionicSlideBoxDelegate.update(); 
  }, function (error) {
    console.log("Error: " + error);
  });

  

  $scope.showItem = function (itemId) {
    $scope.toggleMenuButton(false);
    setTimeout(function () {
      $state.go('main.item', {id: itemId});
    }, 200);
  };

  $scope.noAvatar = function(gender) {
    if (gender === "female") {
      return defaultImages.female;
      } else {
      return defaultImages.male;
      }
  }

  $scope.goToNextSlide = function(handle) {
    $ionicSlideBoxDelegate.$getByHandle(handle).next();
  }

  $scope.goToPreviousSlide = function(handle) {
    $ionicSlideBoxDelegate.$getByHandle(handle).previous();
  }

});
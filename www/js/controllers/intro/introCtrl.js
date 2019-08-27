angular.module('app.controllers')

.controller('intro.introCtrl', function($scope, $ionicSlideBoxDelegate, $state, UserService, SessionStorage, ViewPersistanceStorage, $rootScope, GAService) {
  'use strict';

	$rootScope.$viewHistory.backView = null;

	$scope.trackSlideChanged = function(index) {
		GAService.TrackPageAction('Welcome ' + index,'Carousel Swiped','Login');
		GAService.TrackPageAction('Welcome ' + index,'Page Viewed','login');
	}

  $scope.goToNextSlide = function(handle) {
    $ionicSlideBoxDelegate.$getByHandle(handle).next();
  }

  $scope.goToPreviousSlide = function(handle) {
    $ionicSlideBoxDelegate.$getByHandle(handle).previous();
  }

  

});
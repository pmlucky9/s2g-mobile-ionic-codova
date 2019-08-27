angular.module('app.controllers')

// Controller for the left-menu button
.controller('items.itemCreateCtrl', ['$scope', '$state', 'S2gApi', 'UserService', '$ionicActionSheet', '$ionicModal', '$ionicPopup', 'itemCache', 'updateCache', function($scope, $state, S2gApi, UserService, $ionicActionSheet, $ionicModal, $ionicPopup, itemCache, updateCache) {
  'use strict';

  $scope.pageTitle = 'Create Product';
  $scope.item = {};
  $scope.item.charity_contrib = {};
  $scope.item.charity_contrib.rate = 50; 
  $scope.item.type = "product"; 

  $scope.data = {
    editLoaded : true,
    editItem : false,
    itemSubmitted : false,
    isSaving : false
  }
  $scope.image = {
    savedUrl : null,//url of original image saved to profile
    updatedUrl : null,//url of updated image 
    isSaving : false,//state of saved image
    saveError : false//has error if true
  }

  $scope.saveItem = function (valid) {
    if(valid){
      $scope.data.isSaving = true;
      var saveObject = angular.copy($scope.item);
      //update the saveObject rather than item to prevent flashing of the image
      if ($scope.image.updatedUrl && $scope.image.updatedUrl.length > 0) saveObject.image = $scope.image.updatedUrl;    
      S2gApi.saveItem(saveObject, UserService.token)
      .then( function (response) {
        //on saving update both itemCache objects if they exist
        //using updateCache service
        updateCache.add(response.data).then(function(r){
          $state.go('main.items', { type: 'mine', scrollTop:true });
          $scope.closeProductModal();
        });
      }, function (error) {
        $scope.data.isSaving = false;
        $ionicPopup.alert({
           title: 'Uh-oh',
           template: 'There was an error saving this item, please try again later.'
         });
        console.log(error);
      });
    } else {
      $scope.data.itemSubmitted = true;
    }
  };

  $scope.$watch('item.type', function(newValue, oldValue) {
    if(newValue == 'product')       $scope.pageTitle = 'Create Product';
    else if (newValue == 'service') $scope.pageTitle = 'Create Service';
  });

  $scope.cancel = function () {
    $scope.closeProductModal();
  };

 

}]);

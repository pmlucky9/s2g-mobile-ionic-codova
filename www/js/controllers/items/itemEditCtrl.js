angular.module('app.controllers')

.controller('items.itemEditCtrl', ['$scope', '$state', 'S2gApi', 'UserService', '$stateParams', '$ionicNavBarDelegate', '$ionicPopup', '$ionicViewService', '$ionicModal', 'itemCache', 'updateCache', 'GAService', function($scope, $state, S2gApi, UserService, $stateParams, $ionicNavBarDelegate, $ionicPopup, $ionicViewService, $ionicModal, itemCache, updateCache, GAService) {
  'use strict';

  GAService.TrackPageVisited("Edit Product Detail", "edit");

  $scope.item = {};
  $scope.data = {
    editLoaded : false,
    editItem : true,
    itemSubmitted : false,
    isSaving : false
  }
  $scope.image = {
    savedUrl : null,//url of original image saved to profile
    updatedUrl : null,//url of updated image 
    isSaving : false,//state of saved image
    saveError : false//has error if true
  } 


//used on cancel
  $scope.goBackState = function() {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
  };

  var completeLoadItem = function(){
    if($scope.item.charity_contrib == null || $scope.item.charity_contrib.rate == null) {
      $scope.item.charity_contrib = {};
      $scope.item.charity_contrib.rate = 50;
    }
    $scope.data.editLoaded = true;      
  }

  $scope.getItem = function(){
    //load item from cache (set in showCtrl prior to launching edit state);
    var thisItem = itemCache.get('current');
    if (!thisItem || thisItem.item.id !== $stateParams.id){ 
      //we should never get here (unless on the browser),
      S2gApi
        .getItem( $stateParams.id, UserService.token )
        .then(
          function (response) {
            $scope.item = response.data.item;
            completeLoadItem(); 
          },
          function (reason) {
            console.log(reason);
          });
    } else {
      $scope.item = angular.copy(thisItem.item);
      completeLoadItem();
    }
  }
  $scope.getItem();

  $scope.saveItem = function (itemId, valid) {
    if (valid){
      $scope.data.isSaving = true;
      var saveObject = angular.copy($scope.item);
      //update the saveObject rather than item to prevent flashing of the image
      if ($scope.image.updatedUrl && $scope.image.updatedUrl.length > 0) saveObject.image = $scope.image.updatedUrl;    
      S2gApi.updateItem(saveObject, UserService.token)
      .then( function (response) {
        updateCache.update(saveObject, 'update').then( function () {
          $scope.toggleMenuButton(false);
          $scope.data.isSaving = false;
          setTimeout(function () {
            $state.go('main.item', { id: itemId });
          }, 200);
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
  $scope.deleteItemPopup = function(){
    $ionicPopup.show({  
      template:'<div>Are you sure you want to delete this item? Any associated messages will also be deleted</div>',
      title:"Delete Item",
      scope: $scope,
      buttons: [{
        text:'Delete',
        type:'button-small button-positive',
        onTap: function(e){         
            $scope.deleteItem();
        }
      },
      {
        text: 'Cancel',
        type:'button-small button-positive'
      }]
    });
  };

  
  $scope.deleteItem = function () {
    S2gApi.deleteItem($scope.item, UserService.token) 
    .then( function () {
        updateCache.update($scope.item, 'delete')
        .then( function (r) {
          $scope.toggleMenuButton(false);
          setTimeout(function () {
            $state.go('main.items', { type: 'mine' });
          }, 200);
        });        
    }, function (error) {
      console.log(error);
    });
  };

}]);

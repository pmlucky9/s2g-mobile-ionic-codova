angular.module('app.controllers')
  .controller('items.editFormCtrl', function($scope, $ionicModal, Photo, $ionicActionSheet, $ionicPopup, GAService) {
    'use strict';

    //-->START photo
   
    $scope.updatePhoto = function(source){
    console.log("update", source);
    $scope.image.savedUrl = $scope.item.image;
    Photo.getPicture(source).then(function(imageURI){//getPicture
      $scope.image.isSaving = true;
      Photo.formatPictureUrl(imageURI).then(function(result){ //formatURI into usable result   
        $scope.item.image = result.imageURL;
        Photo.savePicture(result).then(function(savedImage){ //save image to database
          $scope.image.isSaving = false;
          $scope.image.updatedUrl = savedImage;//save it to image object rather than $scope.user to prevent flashing on save
        }, function(message){
          console.log("Save Picture Error: " + message);
          $scope.image.saveError = true;
          $scope.image.isSaving = false;
        }) 
     }, function(message){
      console.log("Format Picture Error: " + message);
      $scope.image.isSaving = false;
      });        
    }, function(message){
      console.log("Get Picture Error: " + message);
      $scope.image.isSaving = false;
    });
  }
  $scope.uploadPhoto = function(){
    if ($scope.image.saveError){
      $scope.showSavePhotoAlert();
    } else {
      $scope.showPhotoMenu();
    }
  }
  $scope.showPhotoMenu = function(){
    $ionicActionSheet.show({
      titleText: 'Please select source',
      cancelText: 'Cancel',
      buttons: [{
        text: 'Gallery'
      }, {
        text: 'Camera'
      }, ],
      buttonClicked: function(index) {
        var photoSource = [Camera.PictureSourceType.SAVEDPHOTOALBUM, Camera.PictureSourceType.CAMERA];
        $scope.updatePhoto(photoSource[index]);
        return true;
      }
    }); 
  }

  $scope.showSavePhotoAlert = function(){
    $ionicPopup.show({
      title: 'Uh-oh',
      template: 'There was an error saving your photo, try again?',
      buttons: [{
        text: 'Yes',
        type: 'button-positive',
        onTap: function(e){
          Photo.savePicture().then(function(savedImage){
          console.log("savedimage", savedImage);
          $scope.image.isSaving = false;
          $scope.image.updatedImage = savedImage;
          }, function(message){
            console.log("Save Picture Error: " + message);
            $scope.image.saveError = true;
            $scope.image.isSaving = false;
          })
        }
      }, {
        text: 'No',
        type: 'button-positive',
        onTap: function(e){
          $scope.image.saveError = false;
          $scope.user.avatar = $scope.image.savedUrl;

        }
      }]
    });
    
  }
    //-->END photo

    //-->START Rate/Unit
    $scope.openModal = function(options, selectedUnit, currentPrice) {
      GAService.TrackPageVisited("Set Price", "edit");

      //opens modal to edit price
      $ionicModal.fromTemplateUrl('templates/items/setprice-modal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.setPrice = modal;
        $scope.modalOptions = options;
        $scope.selectedOptions = {};
        $scope.selectedOptions.unit = (selectedUnit) ? options.indexOf(selectedUnit) : 0; //default to "none"
        $scope.selectedOptions.rate = currentPrice;
        $scope.setPrice.show();
      });

    };

    $scope.closeModal = function() {
      $scope.setPrice.remove();
    };

    $scope.rateOptions = [
      "None",
      "hour",
      "day",
      "week",
      "month",
      "year"
    ];
    $scope.doneOptions = function(valid) {
      if (valid) {
        $scope.item.rate = $scope.selectedOptions.rate; 
        $scope.item.unit = $scope.rateOptions[$scope.selectedOptions.unit];
        $scope.closeModal();
      }
    }

    $scope.selectOption = function(option) {
      $scope.selectedOptions.unit = option;
    }
    //--> END Rate/Unit
  });
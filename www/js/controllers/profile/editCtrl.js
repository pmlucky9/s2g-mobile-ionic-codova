angular.module('app.controllers')

.controller('profile.editCtrl', function($scope, $state, $steroids, S2gApi, UserService, SessionStorage, $stateParams, $ionicPopup, $ionicNavBarDelegate, $filter, $ionicModal, $ionicViewService, neighborhoodSince, defaultImages, $moment, Photo, $ionicActionSheet, FacebookSessionProperties, GAService) {
    'use strict';

    GAService.TrackPageVisited("Edit Profile", "edit");

  console.log('editCtrl state params: ', $stateParams);
  var editType = $stateParams.type;
  $scope.data = {
    newProfile : false,
    formSubmitted : false,
    isLoading : false
  };
  $scope.image = {
      savedUrl : null,//url of original image saved to profile
      updatedUrl : null,//url of updated image 
      isSaving : false,//state of saved image
      saveError : false//has error if true
  }
  $scope.openURL = function (url) {
    console.log('going to open ' + url );
    // $ionicPopup.alert({title: 'doit', template: url});
    $steroids.openURL({url: url}, {
      onSuccess: function (/* parameters */) {
        console.log('Launched' + url);
      },
      onFailure: function (error) {
        console.log('Failed to launch: ' + url);
        console.log('with error: ' + error.errorDescription);
      }
    });
  };

  $scope.getPreferences = function(){
    S2gApi.getPreferences(UserService)
      .then(function(response) {
        $scope.preferences = response.data;
        }, function (error) {
      console.log(error);
    });
  };

  if (editType === 'new') {
    $scope.pageTitle = 'Create Profile';
    $scope.user = angular.copy(UserService.userData);
    $scope.user.email = UserService.username;

    // If any properties are missing from the UserService that are present in the facebook 
    // properties, copy over the facebook properties.
    console.log('facebook properties are: ', FacebookSessionProperties);
    console.log( 'user properties prior facebook defaults: ', $scope.user);
    var defaultProps = [ 'avatar', 'gender', 'firstName', 'lastName' ];
    for (var i = defaultProps.length - 1; i >= 0; i--) {
      var property = defaultProps[i];
      if (FacebookSessionProperties[property] && !$scope.user[property]) {
        console.log('adding property %s: ', property, FacebookSessionProperties[property]);
        $scope.user[property] = FacebookSessionProperties[property];

        // special case for avatar, it needs to be updated in the 
        // scope.image.updatedUrl for it to be updated.
        if (property === 'avatar') {
          $scope.image.updatedUrl = FacebookSessionProperties.avatar;
        }
      }
    };
    console.log( 'updated properties with facebook defaults: ', $scope.user);

    $scope.preferences = {};
    $scope.neighborhood = UserService.neighborhoodObj.name;
    $scope.data.newProfile = true;
    $scope.hideMenu = true;
    $ionicViewService.clearHistory();//prevent user from going back
  } else if (editType === 'edit') {
    $scope.editProfile = true;
    $scope.pageTitle = 'Edit Profile';
    $scope.getPreferences();
    $scope.user = angular.copy(UserService.userData);
    $scope.neighborhood = UserService.neighborhoodObj.name; 
  }
  console.log( 'profile initial data: ', $scope.user);
  
  $scope.updatePhoto = function(source){
    $scope.image.savedUrl = $scope.user.avatar;
    Photo.getPicture(source).then(function(imageURI){//getPicture
      $scope.image.isSaving = true;
      Photo.formatPictureUrl(imageURI).then(function(result){ //formatURI into usable result   
        $scope.user.avatar = result.imageURL;
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
  
  $scope.noAvatar = function(gender) {
    if (gender === 'female') {
      return defaultImages.female;
    } else {
      return defaultImages.male;
    }
  };

  $scope.cancelEdit = function () {
    $scope.toggleMenuButton(true);
    $state.go('main.profile');

  };
   
  $scope.updateProfile = function (user, isValid) {
    if (isValid) {
      $scope.data.isLoading = true;
      //list of properties we are watching
      var saveProps = [
        "firstName",
        "lastName",
        "gender",
        "neighborhoodSince"
      ];
      var saveObject = {};
      //populate saveObject with updated values
      for (var i=0;i<saveProps.length;i++){
        if (String($scope.user[saveProps[i]]) !== String(UserService.userData[saveProps[i]])){
          saveObject[saveProps[i]] = $scope.user[saveProps[i]];
        }
      }
      //phone is special
      if($scope.data.newProfile){
          saveObject.phone = {};
          saveObject.phone.cell = $scope.user.phone.cell;
      } else {
        if ($scope.user.phone.cell !== UserService.userData.phone.cell) {
          saveObject.phone={};
          saveObject.phone.cell = $scope.user.phone.cell;
        }
      }
      // Avatar is special: the url of the image in scope.user.avatar 
      // is not updated on avatar update because it causes a refresh 
      // (and a flash) in the browser when the actual url is loaded.
      if ($scope.image.updatedUrl && $scope.image.updatedUrl.length > 0)  {
        saveObject.avatar = $scope.image.updatedUrl;
      }

      S2gApi.updateProfile(UserService.username, UserService.token, saveObject)
      .then(function ( response ) {
        //update userservice with updated items
        for (var key in saveObject){
         UserService.userData[key] = saveObject[key];
        }
        UserService.userData.email = $scope.user.email;
        SessionStorage.store(UserService);
        S2gApi.updatePreferences(UserService.username, UserService.token, $scope.preferences)
          .then (function() {
            $scope.data.isLoading = false;
            if (editType === 'new'){
              $state.go('main.home');
            } else {
              $scope.toggleMenuButton(true);
              $state.go('main.profile');
            }
          }, function(error) {
            $scope.data.isLoading = false;
            console.log(error);
      }, function (error) {
        $scope.data.isLoading = false;
        console.log(error);
      });
    });
    } else {
      $scope.data.isLoading = false;
      $scope.data.formSubmitted = true;
    }
  };

  //---NEIGHBORHOOD SINCE 
  $ionicModal.fromTemplateUrl('templates/profile/neighborhood-since-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.editNeighborhoodSince = modal;
  });

  $scope.openModal = function () {
    $scope.modalOptions = neighborhoodSince.timeOptions;
    $scope.editNeighborhoodSince.show();
  };
  $scope.closeModal = function () {
    $scope.editNeighborhoodSince.hide();
  };
  $scope.inYears = function(date){
     //function defined in services/global.js
     return neighborhoodSince.inYears(date);
  };
  
  $scope.selectOption = function(val) {
    $scope.selectedOption = val;
    var d;
    if (val === 0){
      d = $moment().subtract('months', 6); //if less than one year default to 6 months ago
    } else {
      d = $moment().subtract('years', val);
    }
    $scope.user.neighborhoodSince = d._d;
    $scope.editNeighborhoodSince.hide();
  };

  //--- HELP POPUPS
  $scope.messages = { 
    'phone' : {
      title : 'Why do we need your Phone number?',
      message : 'You may receive messages (SMS) during the borrowing and lending process.'
    }, 
    'yearsInHood' : {
      title : 'Why do we ask Years in Neighborhood?',
      message : 'Years in neighborhood helps your neighbors feel more comfortable lending or borrowing.'
    }, 
    'gender' : {
      title : 'Why do we ask Gender?',
      message : 'We prefer to personalize the service and use the proper pronouns.'
    }
  };

  $scope.showMessage = function (message) {
    $ionicPopup.alert({
      title: message.title,
      template: message.message,
      okType: 'button-positive button-small col-20 col-offset-80'
    });
  };

  });
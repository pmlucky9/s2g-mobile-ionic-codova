angular.module('app.controllers')
// Controller that drives through the signup process.
.controller('SignUpCtrl', function($scope, $state, $steroids, S2gApi, UserService, $ionicPopup, $ionicNavBarDelegate, $rootScope, SessionStorage, $google, locationService, PushService, $device, GAService) {

  'use strict';
  $scope.user = {};
  $scope.entry = {};
  $scope.data = {
    isLoading : false,
    loginError : false
  };

  //******** ADDRESS VERIFICATION *******//
  // 1. User Enters address - we try and find matching addresses through AutoComplete
  // 2. As long as the user puts something in the address field we submit it to Google for Verification
  // 3. We read back the geocode to format the addresss and look for number, street, city, state, country 
  //    - if any of those are missing we dont accept the address --> alert box
  // 4. If OK We use lat lng to get neigborhood data
  //    - if no neighborhood --> "neighborhood-lookup-error"
  //    - if neighborhood is valid --> signup.confirm-neighborhood(mapCtrl)
  //   

  $scope.introBack = function (viewName, viewScope) {
    console.log($rootScope.$viewHistory);
    if($rootScope.$viewHistory.currentView.url)
    {
      console.log($rootScope.$viewHistory.currentView.url);
      var viewName;
      var viewScope;
      switch ($rootScope.$viewHistory.currentView.url)
      {
        case '/login': viewName = "Login"; viewScope = "login";
                          break;
        case '/find-your-neighborhood': viewName = "Create Account"; viewScope = "create-account";
                          break;
        default: viewName = "Intro"; viewScope = "intro";
      }
      GAService.TrackPageAction(viewName, "Back Tapped" , viewScope);
      $ionicNavBarDelegate.back();
    }
  }
   

  //format google result into usable parts - extract address, city, state, zip 
  //these come in as an array and arent guaranteed to be returned in a specific order
  var formatGeocode = function(geocode) {
    var googAddress = geocode.address_components; // jshint ignore:line
    var userAddress = {};
    //temp storage for a few things out that we will not save discretely in the address object
    var temp = {};
    angular.forEach(googAddress, function(a) {
      if (a.types.indexOf('street_number') !== -1) {
        temp.number = a.short_name; // jshint ignore:line
      } else if (a.types.indexOf('route') !== -1) {
        temp.street = a.short_name; // jshint ignore:line
      } else if (a.types.indexOf('locality') !== -1) {
        userAddress.city = a.short_name; // jshint ignore:line
      } else if (a.types.indexOf('administrative_area_level_1') !== -1) {
        userAddress.state = a.short_name; // jshint ignore:line
      } else if (a.types.indexOf('country') !== -1) {
        userAddress.country = a.short_name; // jshint ignore:line
      } else if (a.types.indexOf('postal_code') !== -1) {
        userAddress.zip = a.short_name; // jshint ignore:line
      } 
    });
    //error handling
    if (!temp.number || !temp.street || !userAddress.city || !userAddress.state || !userAddress.country ) {
      return ('error');
    } else {
      userAddress.route = temp.number + ' ' + temp.street;
      if ($scope.entry.apt) {
        userAddress.apt = $scope.entry.apt;
        userAddress.route += ' #' + userAddress.apt;
      }
      userAddress.formattedAddress = userAddress.route + ', ' + userAddress.city + ', ' + userAddress.state;
      return userAddress;
    }
  };

  $scope.addressError = function(type){
    //type = neighborhood or address
    $scope.data.isLoading = false;
    $state.go('signup.neighborhood-lookup-error', { type: type });
  };
  
  $scope.locateAddress = function(){
    $scope.data.isLoading = true;
    $scope.user.address = '';
    $scope.user.location = '';
    locationService.getLocation($scope.entry.address).then (
      function(result) {
        $scope.user.address = formatGeocode(result[0]);
        if ($scope.user.address === 'error'){
          $scope.addressError('address');
        } else {
          $scope.user.location = {};
          var lat = $scope.user.location.lat = result[0].geometry.location.lat();
          var lng = $scope.user.location.lng = result[0].geometry.location.lng();   
          var latLng = '@' + lat + ',' + lng;
          S2gApi.getNeighborhoodatLocation( latLng )
          .then( function (data) {
            $scope.user.neighborhood = data;
            if (data.supported){
              if(data.geojson) {
                $scope.geojson = data.geojson;           
              }
              $scope.data.isLoading = false;
              $state.go('signup.confirm-neighborhood');
            } else {
              //invalid neighborhood
              $scope.addressError('neighborhood');
              
            }
          }, function (error) {
            console.log(error);
            // $scope.addressError('neighborhood');
            /* for F&F trial, nobody fails-> we put them in mountbaker. 
             * //invalid neighborhood
             * $scope.addressError('neighborhood');
            */
            // $scope.user.location = { lat: 47.6122829, lng: -122.2892899 };
            S2gApi.getNeighborhoodatLocation( '@47.6122829,-122.2892899')
            .then( function (data) {
              $scope.user.neighborhood = data;
              $scope.user.neighborhood.name = '';
              if (data.supported){
                if(data.geojson) {
                  $scope.geojson = data.geojson;           
                }
                $scope.data.isLoading = false;
                $state.go('signup.confirm-neighborhood');
              } else {
                //invalid neighborhood
                $scope.addressError('neighborhood');
                track('Neighborhood Not Active','Login','Page Viewed')
              }
            }, function (error) {
              console.log(error);
              //invalid neighborhood
              $scope.addressError('neighborhood');
              track('Neighborhood Not Active','Login','Page Viewed')
            });
            /* end f&f force neighborhood */ 
          });
        }
      }, function (error) {
        console.log(error);
        //invalid address
        $scope.addressError('address');
        track('Neighborhood Not Found','Login','Create Account Tapped')
      });
  };


  $scope.createAccount = function (user) {
    $scope.data.isLoading = true;
    console.log('creating user account');
    console.log( JSON.stringify(user, null, 2) );
    S2gApi.createAccount( user.email, user.password, user.neighborhood.id, user.location, user.address )
    .then( function (data) {
        UserService.username = user.email;
        UserService.password = user.password;
        UserService.userId = data.data.id;
        UserService.userData.location = user.location;
        UserService.neighborhood = user.neighborhood.id;
        UserService.neighborhoodObj = user.neighborhood;
        UserService.userData.address = user.address;
        S2gApi.getAuthToken( UserService.username, UserService.password)
        .then( function (data) {
          UserService.token = data;
          SessionStorage.store(UserService);
          $scope.toggleMenuButton(false);
          $scope.data.isLoading = false;
          setTimeout(function () {
            $state.go('profile.create', {type: 'new'});
          }, 100); 
        }, function (error) {
          console.log(error);
        });
      }, 
      function (error) {
        $scope.data.isLoading = false;
        console.log(error);
        if(error.status === 'validation failed')
        {
          $ionicPopup.alert({title: 'Error', template: 'Please enter a valid email address.'});
        }
        else if ( error.status === 'error' ) {
          if( error.message && error.message.code )
          {
            switch (error.message.code) {
              case 11000:
                $ionicPopup.alert({title: 'Error', template: 'This email address is already in use.'});
              break;
            default:
              $ionicPopup.alert({title: 'Error', template: 'We are unable to proceed with the creation of your account, please try again later.'});
            }
          }
        } else {
          $ionicPopup.alert({title: 'Error', template: 'We are unable to proceed with the creation of your account, please try again later.'});
        }
      });
  };

  var formatAddress = function(address) {
    //take the object from google and format it for display to match the address we are saving
    var addressObject = {};
    // remove 'United States from results'
    var country = ', United States';
    var desc = address.description;
    addressObject.fullAddress = address.description.substring(0, desc.length - country.length);  
    return addressObject;
  };

  var filterPredictions = function(predictions){
    var acList = [];
    angular.forEach(predictions, function (p){
      //console.log("pred", p);
      var types = p.types;
      var acItem = {};
      //if type contains street_address we know its an address
      if (types.indexOf('street_address') !== -1) {
        acItem = formatAddress(p);
        this.push(acItem);
      } 
      //if type contains route and the first block of text is a number (plus one letter) (123, 123A) we assume it is an address
      else if (types.indexOf('route') !== -1 && p.description.split(' ')[0].match(/^\d+[a-zA-Z]?$/)) {
        acItem = formatAddress(p);
        this.push(acItem);
      }
      //if neither we do nothing
      else {
        
      }

    }, acList);

    $scope.showList = (acList.length > 0) ? true : false;
    $scope.predictions = acList;
  };

  var getPlacePredictions = function(address) {
    var service = new $google.maps.places.AutocompleteService();
    var request = {
      input: address,
      componentRestrictions: {country: 'us'},
      types: ['geocode'] 
    };
    service.getPlacePredictions(request, function (predictions, status) {
      if (status === 'OK'){
        //each prediction from google is an object
        //filter each prediction to look for street addresseses only
        filterPredictions(predictions);
      } else if (status === 'ZERO_RESULTS'){
        //close drop down list
        $scope.showList = false;
      } else {
        console.log('getPlacePredictions unexepected callback status: %s', status);
      }
    });
  };

  $scope.autoComplete = function(address){
    if (address) {   
      getPlacePredictions(address);    
    } else {
      $scope.showList = false;
    }
  };

  $scope.setAddress = function(address) {
    $scope.entry.address = address;
    $scope.showList = false;
  };

  $scope.neighborhoodConfirmed = function () {
    // Forcing everybody in Mt. Baker. while we test.
    var neighborhoodId =  '53855fd7734425d0711e3199';
    $scope.user.neighborhood.id = neighborhoodId;
    UserService.neighborhoodName = $scope.user.neighborhood.name;
    $state.go('signup.create-your-account');
  };

  $scope.updateProfile = function () {
    S2gApi.updateProfile( UserService.username, UserService.token, {
      address: $scope.user.address,
    }).then( function () {
           
    }, function (error) {
      console.log(error);
    });
  };

  $scope.registerDevice = function () {

    var biData = null;

    try {
      bundleIdentifier.get( null, function (d) {
        biData = d;
        console.log('bundleIdentifier data:', d);
        registerThisDevice();
      }, function (err) {
        console.log('failed to get bundleIdentifier data:', err);
        // alert('failed to get bundleIdentifier data:' + JSON.stringify(err));
      });
    } catch (outer) {
      // alert('ailed to register device: no bundleIdentifier plugin');
      console.log( 'failed to register device: no bundleIdentifier plugin');
    }

    function registerThisDevice () {
      try {
        // Register the device for Push Notifications on S2G Server
        var deviceId = $device().uuid; 
        var type = $device().platform.toLowerCase();
        var deviceToken = PushService.pushToken;
        console.log(deviceId, type, deviceToken, UserService.username);
        // alert( deviceId + ',' + type + ',' + deviceToken + ',' + UserService.username + ',' + JSON.stringify(UserService.token) + ',' + biData.bundleId );
        S2gApi.registerDevice(
          UserService.username,
          UserService.token,
          biData.bundleId,
          deviceId,
          type,
          deviceToken
        )
        .then(
          function () {
            // Success! 
            console.log('Successfully registered device on S2G');
          },
          function (error) {
            // alert('S2G register device api error' + JSON.stringify(error));
            console.log('S2G register device api error');
            console.log(error);
          }
        );
      }
      catch (error) {
        // alert('failed to register device' + JSON.stringify(error));
        console.log('failed to register device');
        console.log(error);
      }
    }
  };

  $scope.login = function (user) {
    $scope.data.isLoading = true;
    UserService.username = user.email;
    UserService.password = user.password;
    S2gApi.getAuthToken(UserService.username, UserService.password).then(
      function (data) {
        UserService.token = data;
        // Get User Data
        $scope.getUserData( function (err, response) {
          if (response) {
            console.log('Successfully fetched user data');
          }
        });
        console.log('Push Token: ' + PushService.pushToken);
        SessionStorage.store(UserService);
        $scope.registerDevice();
        $scope.data.isLoading = false;
        $scope.data.loginError = false;
        $state.go('main.home');
      },
      function (error) {
        $scope.data.isLoading = false;
        $scope.data.loginError = true;
        $scope.errorMessage = "Username not found, please try again.";
        console.log(error);
      }
    );
  };

  $scope.facebookLogout = function () {
    $steroids.addons.facebook.logout()
    .then( function () {
      $ionicPopup.alert({ title: 'Facebook manual logout', template: 'done'});
    });
  };

  $scope.facebookLogin = function() {
    var facebookLoginFail = 'Your Facebook user email doesn\'t match any existing MyNeighbor accounts. ' +
                            'Please login with your MyNeighbor email and password or create an account for your facebook email.';

    function FacebookError(msg) {
      this.message = msg;
    }
    FacebookError.prototype = Object.create(Error.prototype);

    function S2GError(msg) {
      this.message = msg;
    }
    S2GError.prototype = Object.create(Error.prototype);

    // if ($steroids.addons.facebook.session.get().userID)  {
    //   return;
    // }

    $steroids.addons.facebook.login(['public_profile', 'user_friends', 'email'])
    .then( function (response) {
      console.log('processing fb login response');
      console.log( JSON.stringify(response, null,2));
      if (!response.authResponse) {
        throw new FacebookError('Facebook is unable to authenticate your account properly.\n\nPlease log in with your MyNeighbor username and password instead.');
      }
      var expiration = new Date();
      expiration.setSeconds(response.authResponse.expiresIn);
      $scope.facebookProperties = {
        token: response.authResponse.accessToken,
        expiration: expiration.toISOString()
      };
      return $steroids.addons.facebook.api('/me', {fields: 'email'});
    })
    .then( function (response) {
      console.log('processing fb api get response');
      console.log(JSON.stringify(response, null,2));
      if (!response.email) {
        throw new FacebookError('Did not get an email from facebook');
      }
      $scope.facebookProperties.email = response.email;
      return S2gApi.facebookLogin($scope.facebookProperties);
    })
    .then( function (response) {
      console.log('processing s2g fbapi login');
      console.log(JSON.stringify(response, null,2));
      UserService.username = $scope.facebookProperties.email;
      UserService.token = { 'access_token': response.data.token };
      // Get User Data
      $scope.getUserData( function (err, response) {
        if (response) {
          console.log('Successfully fetched user data');
        }
      });
      SessionStorage.store(UserService);
      $scope.registerDevice();
      $state.go('main.home');
    })
    .error( function (err) {
      console.log('got an error');
      console.log(JSON.stringify(err, null,2));
      if (err.status && err.status === 404 ) {
        throw new S2GError(404, facebookLoginFail);
      }
      throw new S2GError('status: ' + err.status + JSON.stringify(err) + JSON.stringify($scope.facebookProperties));
    })
    /* jshint ignore:start */
    .catch( FacebookError, function (e) {
      console.log('got a FB exception');
      console.log(JSON.stringify(e, null,2));
      $ionicPopup.alert({ title: 'Facebook Login', template: e.message });
    })
    .catch( S2GError, function (e) {
      console.log('got a S2G exception');
      console.log(JSON.stringify(e, null,2));      
      $ionicPopup.alert({title: 'Facebook Login', template: e.message});
    })
    .catch (function (e) {
      console.log('got an unexpected exception');
      console.log(JSON.stringify(e, null,2));       
      $ionicPopup.alert({ title: 'Facebook Login', template: 'Sorry,  we could not find an account matching your facebook email.' });
    })
    /* jshint ignore:end */
    ;
  };

  $scope.openURL = function (url) {
    console.log('going to open ' + url );
    // $ionicPopup.alert({title: 'doit', template: url});
    $steroids.openURL({url: url}, {
      onSuccess: function(/* parameters */) {
        console.log('Launched' + url);
      },
      onFailure: function(error) {
        console.log('Failed to launch: ' + url);
        console.log('with error: ' + error.errorDescription);
      }
    });
  };

  //--- HELP POPUPS
  $scope.messages = { 
    'neighborhood' : {
      title : '<b>MyNeighbor</b> is exclusively for neighbors!',
      message : 'By confirming you reside in the neighborhood you sign up with, you are confident that you will be sharing with <b>your</b> neighbors.'
    }, 
  };

  $scope.showMessage = function (message) {
    $ionicPopup.alert({
      title: message.title,
      template: message.message,
      okType: 'button-positive button-small col-20 col-offset-80'
    });
  };   
});


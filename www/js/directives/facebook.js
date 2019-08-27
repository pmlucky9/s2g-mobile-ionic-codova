angular.module('app.directives')
  // .directive("wouldYouTile", function () {
  //   return {
  //     controller: 'wouldYouTileCtrl',
  //     restrict: "E",
  //     templateUrl: "/templates/partials/would-you-tile.html"
  //   };
  // })
/*
  Directive to add overlay to sample images and to set images as backgrounds
  USAGE:
  <sample-filter item="item" data-class="image"></sample-filter>
  -> Pass image url in to set src on image
  -> Set data-class to any classes you'd like added to underlying div
  -> If directive is not in a repeater, you must wait for data to load
    before inserting element into DOM. Can be accomplished by
    setting ng-if="item.image"
*/
//item images
.directive('mnFacebook', function () {
  return {
    restrict: 'E',
    // template: '<p>hi</p>',
    template: '<div class="button button-positive button-block" ng-click="yo( {{ user }} )">Sign up with Facebook</div>',
    controller: function($scope, $steroids, $state, $ionicPopup, UserService, SessionStorage, S2gApi, FacebookSessionProperties) {


      $scope.yo = function (user) {

        console.log( 'user: ', user);
        function FacebookError(msg)     { this.message = msg; }
        function S2GError(msg)          { this.message = msg; }
        function SteroidsFBError(msg)   { this.message = msg; }

        $steroids.addons.facebook.login(['public_profile', 'user_friends', 'email'])
        .then( function (response) {
          console.log('processing fb login response: ', response);
          if (!response.authResponse) {
            throw new FacebookError('Facebook is unable to authenticate you properly.\
              \n\nPlease create a MyNeighbor account using email and password.');
          }
          var expiration = new Date();
          expiration.setSeconds(response.authResponse.expiresIn);
          FacebookSessionProperties.token = response.authResponse.accessToken;
          FacebookSessionProperties.expiration = expiration.toISOString();

          // return $steroids.addons.facebook.api('/me', {fields: 'email'});
          getEmailContinuation();

        }, function (cause) {
          console.log( 'Error calling the facebook addon:', cause);
          $ionicPopup.alert({ title: 'Facebook Login', 
            template: 'Unable to initialize the Facebook SDK.\nPlease create a MyNeighbor account using email and password'});
        });

        function getEmailContinuation() {
          $steroids.addons.facebook.api('/me', {fields: ['email','gender', 'first_name', 'last_name']}).then( function (response) {
            console.log('processing fb api get response: ', response);
            if (!response.email) {
              $ionicPopup.alert({ title: 'Facebook Login', 
                template: 'Your Facebook account did not provide an email.\n\nPlease create a MyNeighbor account using email and password.'});
            } else {
              FacebookSessionProperties.email = response.email;
              FacebookSessionProperties.firstName = response.first_name;
              FacebookSessionProperties.lastName = response.last_name;
              FacebookSessionProperties.gender = response.gender;
              FacebookSessionProperties.avatar = 'https://graph.facebook.com/' +  response.id +'/picture?width=300&height=400';
              console.log('facebook properties are: ', FacebookSessionProperties);
              user.email = response.email;

              user.password = '__' + Math.random();
              console.log('create an account for ', user.email);
              createAccountContinuation();
            }
            // $state.go('profile.create');
          }, function (err) {
            console.log('fb /me error:', err);
            $ionicPopup.alert({ title: 'Facebook Login', 
              template: 'Unable to communicate with Facebook.\nPlease create a MyNeighbor account using email and password'});
          });
        }

        function createAccountContinuation() {
          S2gApi.createAccount( user.email, user.password, user.neighborhood.id, user.location, user.address).then( function (data) {
            UserService.username = user.email;
            UserService.password = user.password;
            UserService.userId = data.data.id;
            UserService.userData.location = user.location;
            UserService.neighborhood = user.neighborhood.id;
            UserService.neighborhoodObj = user.neighborhood;
            UserService.userData.address = user.address;
            console.log('retrieve an auth token for ', user.email);
            // return S2gApi.getAuthToken( UserService.username, UserService.password);
            loginWithFacebookContinuation();
          }, function (err) {
            console.log('S2GApi.createAccount error:', err);
            if (err.status === 'validation failed') {
              $ionicPopup.alert({title: 'Facebook Login', 
                template: 'Unable to create a MyNeighbor account with the information provided by your Facebook account.\n\nPlease create a MyNeighbor account using email and password.' });
            } else if (err.status === 'error' ) {
              if (err.message && err.message.code ) {
                switch (err.message.code) {
                  case 11000:
                    UserService.username = user.email;
                    UserService.password = user.password;
                    // UserService.userId = data.data.id;
                    UserService.userData.location = user.location;
                    UserService.neighborhood = user.neighborhood.id;
                    UserService.neighborhoodObj = user.neighborhood;
                    UserService.userData.address = user.address;
                    //$ionicPopup.alert({title: 'Facebook Login', template: 'This email address is already in use.\n\nPlease log-in or create a MyNeighbor account using a different email or Facebook account.' });
                    loginWithFacebookContinuation();
                  break;
                  default:
                    $ionicPopup.alert({title: 'Facebook Login', template: 'We are unable to proceed with the creation of your account, please try again later.' });
                }
              }
            } else {
              $ionicPopup.alert({title: 'Facebook Login', template: 'We are unable to proceed with the creation of your account, please try again later.'});
            }  
          });
        }

        function loginWithFacebookContinuation() {
          S2gApi.facebookLogin(FacebookSessionProperties).then( function ( response ) {
            console.log('processing s2g fbapi login: ', response);
            UserService.username = FacebookSessionProperties.email;
            UserService.token = { 'access_token': response.data.token };
            SessionStorage.store(UserService);

            $scope.registerDevice(); // OMG!!  this sort of stuff should be evented.
            getUserDataContinuation();

            // // Get User Data
            // $scope.getUserData( function (err, response) {
            //   if (response) {
            //     console.log('Successfully fetched user data');
            //   }
            // });

            // SessionStorage.store(UserService);
            // $state.go('profile.create', {type: 'new'});
          }, function (err) {
            console.log( 'S2G.facebookLogin error', err);
            $ionicPopup.alert({title: 'Facebook Login', 
              template: 'Your account is created, but we are unable to log you in. Please try to login with Facebook later.' });
          });
        }

        function getUserDataContinuation() {
          S2gApi.getUserByName( UserService.username, UserService.token ).then( function (response) {
            console.log("S2GApi.getUserByName: ", response);
            UserService.neighborhood = response.neighborhood;
            UserService.userId = response.id;
            UserService.avatar = response.avatar;
            UserService.userData = response;
            SessionStorage.store(UserService);
            $state.go('profile.create', {type: 'new'});
          }, function (err) {
            console.log('S2GApi.getUserByName error: ', err);
            $ionicPopup.alert({title: 'Facebook Login', 
              template: 'Your account is created, but we are unable to log you in. Please try to login with Facebook later.' });
          });
        };

        // function getAuthTokenContinuation() {
        //   S2gApi.getAuthToken( UserService.username, UserService.password).then( function (data) {
        //     console.log('hey wait, I should not be here...');
        //     UserService.token = data;
        //     SessionStorage.store(UserService);
        //     $scope.toggleMenuButton(false);
        //     $scope.data.isLoading = false;
        //     setTimeout(function () {
        //       $state.go('profile.create', {type: 'new'});
        //     }); 
        //   }, function (err) {
        //     console.log('S2GApi.getAuthToken error:', err);
        //     $ionicPopup.alert({title: 'Facebook Login', template: 'Your account is created, but we are unable to log you in. Please try to login with Facebook later.' });
        //   });
        // }
      }
    }
  }
});


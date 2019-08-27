angular.module('app.controllers', [])

// Controller for the left-menu button

.controller('MainCtrl', function($scope, $ionicPlatform, $ionicSideMenuDelegate, S2gApi, UserService, $state, $ionicModal, $ionicNavBarDelegate, $ionicPopup, $timeout, $steroids, SessionStorage, ViewPersistanceStorage, PushService, $location, $device, GAService, GAStorage, $rootScope) {
  'use strict';
  // initialize push notifications
  ionic.Platform.ready(function() {
    // Push Services
    PushService.initPushPlugin($scope);

    // Google Analytics -- load previous GA info inf any
    var gainfo = GAStorage.get();
    if(!gainfo)
    {
      gainfo = {
        anonymousId: $device.uuid ? $device().uuid : 'browser-' + Math.random().toString().slice(2)
      };
      GAStorage.store(gainfo);
    }

    if(UserService.username)     
    {
      gainfo.username = UserService.username;
    }
    if(UserService.neighborhood)
    {
      gainfo.neighborhood = UserService.neighborhood;
    }
    $scope.gaService = GAService.initialize(gainfo, $scope);
    
  });

  $scope.track = function (category, item, action) {
    GAService.TrackPageAction(category, action, item);
  };


  $scope.leftButtons = [{
    type: 'button-icon button-clear ion-navicon',
    tap: function ( /* e */) {
      $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
    }
  }];

  $scope.showMenuButton = {toggle: true};

  $scope.toggleMenuButton = function(value) {
    $scope.showMenuButton.toggle = value;
  };

  $scope.handleBack = function (e) {
    console.log($rootScope.$viewHistory);
    if($rootScope.$viewHistory.currentView.url)
    {
      console.log($rootScope.$viewHistory.currentView.url);
      GAService.TrackPageAction("Back Tapped", $rootScope.$viewHistory.currentView.url , $rootScope.$viewHistory.currentView.stateId);
    }
    $scope.goBack();
  };

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  // recipients is an array of email address
  $scope.composeEmail = function (subject, body, recipients) {
    window.plugins.emailComposer.showEmailComposerWithCallback(
      function ( res ) { 
        console.log( 'done composing email');
        console.log(JSON.stringify(res, null,2 )); 
      },
      subject, body, recipients, null, null, false, null, null);
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

    if ($steroids.addons.facebook.session.get().userID)  {
      return;
    }

    $steroids.addons.facebook.login({scope: 'email'})
    .then( function (response) {
      if (!response.authResponse) {
        throw new FacebookError('Facebook is unable to authenticate your account properly.\n\nPlease log in with your MyNeighbor username and password instead.');
      }
      $scope.facebookProperties = {
        token: response.authResponse.accessToken,
        expiration: new Date(parseInt(response.authResponse.expirationTime)).toISOString()
      };
      return $steroids.addons.facebook.api.get('/me', {fields: 'email' });
    })
    .then( function (response) {
      if (!response.email) {
        throw new FacebookError('Did not get an email from facebook');
      }
      $scope.facebookProperties.email = response.email;
      return S2gApi.facebookLogin($scope.facebookProperties);
    })
    .then( function (response) {
      UserService.username = $scope.facebookProperties.email;
      UserService.token = { 'access_token': response.data.token };
      // Get User Data
      $scope.getUserData( function (err, response) {
        if (response) {
          console.log("Successfully fetched user data");
        }
      });
      SessionStorage.store(UserService);
      $state.go('main.home');
      $scope.loginModal.remove();
    })
    .error( function (err) {
      if (err.status && err.status === 404 ) {
        throw new S2GError(404, facebookLoginFail);
      }
      throw new S2GError('status: ' + err.status + JSON.stringify(err) + JSON.stringify($scope.facebookProperties));
    })
    /* jshint ignore:start */
    .catch( FacebookError, function (e) {
       $ionicPopup.alert({ title: 'Facebook Login', template: e.message });
    })
    .catch( S2GError, function (e) {
      $ionicPopup.alert({title: 'Facebook Login', template: e.message});
    })
    .catch (function (e) {
      $ionicPopup.alert({ title: 'Facebook Login', template: 'Sorry,  we could not find an account matching your facebook email.' });
    })
    /* jshint ignore:end */
    ;
  };
  $scope.openURL = function (url) {
    console.log('going to open ' + url );
    // $ionicPopup.alert({title: 'doit', template: url});
    $steroids.openURL({url: url}, {
      onSuccess: function(parameters) {
        console.log("Launched" + url);
      },
      onFailure: function(error) {
        console.log('Failed to launch: ' + url);
        console.log("with error: " + error.errorDescription);
      }
    });
  };
  $scope.logout = function () {
    console.log('logging out');
    $steroids.addons.facebook.logout(); // log out of Facebook first
    UserService.logout();
    ViewPersistanceStorage.remove(); // remove saved last view since user is now logged out and we reset the sequence
    $state.go('signup.find-your-neighborhood');
  };

  // 401 handler for S2gApi
  $scope.$on( 's2g:401', function() {
    // clear UserService and show login modal.
    $scope.user = { email: UserService.username };
    SessionStorage.remove();
    UserService.logout();
    $steroids.addons.facebook.logout();
    $scope.openLoginModal();
  });
// ---- START NOTIFICATIONS ----
  $scope.showNotification = function(message) {
    //if notification is already open wait for it to close and try again
    if ($scope.notify && $scope.notify._isShown){
    $timeout(function(){ $scope.showNotification(message); }, 1000);
    } else {
      $scope.message = message;
      $ionicModal.fromTemplateUrl('../templates/partials/notification.html', {
        scope: $scope,
        animation: 'slide-left-right',
        backdropClickToClose: false,
        viewType:"notification"
      }).then( function( notify ) {
        $scope.notify = notify;
        $scope.notify.show();
        $timeout(function(){
          $scope.closeNotification();
        }, 5000);
      });
    }
  };

  $scope.goToMsg = function( path ) {
    console.log('going to: ', path);
    $location.url(path);
    $scope.closeNotification();
  };

  $scope.closeNotification = function() {
    $scope.notify.remove();
  }; 
  $scope.$on('notify.hidden', function() {
     // Execute action
     $console.log("notify hidden");
  });
  
  // push notification handler for S2gApi
  $scope.$on( 's2g:push', function(e, p) {
    if (p.foreground && (p.foreground == "true" || p.foreground == "1") ) { 
      console.log('-- Handling foreground push --- ');
      // Foreground running app -- confirm with user for action
      // Parse the URL to get the message data
      //   For now all messages point to conversations
      //   url: 'main/conversation/:itemId/:replyId/:type',//type: item or shoutout

      // on android, the url is p.payload.uri
      var u = p.uri || p.payload.uri;
      var url = u.split('/');
      if (url[1] == 'conversation'){
        var replyId = url[3];
        S2gApi
        .getConversation( UserService.token, replyId)
        .then(
          function (response) {
            var c = response.data;
            var msg = c.messages[0];
            var sender = 'borrower';            
            if (msg.sender == c.lender.id) sender = 'lender';
            var message = {
              alert: msg.content,
              subject: msg.subject,
              image: c[sender].avatar,
              from: c[sender].nickname,
              url: u
            }; 
            $scope.showNotification(message);                   
          },
          function (reason) {
            console.log("convo error", reason);
          });
      } else {
        //if not conversation take info from payload
        var message = {
          alert: p.alert,
          url: u
        };
        $scope.showNotification(message);
      }
    }
    else { // Background running app -- open and direct
      console.log( '-- Handling a background push ---');
      if(p.payload && p.payload.uri) {
        // push android
        window.location.href = '#/' + p.payload.uri;
      }
      else if (p.uri) {
        // ios
        $timeout(function() {
          if (p.foreground !== 1) { // Background running app -- open and direct
            ionic.Platform.ready(function() {
              $scope.toggleMenuButton(false);
              window.location.href = '#/' + p.uri;
            });
          }
        }, 1500);
      }
    }
  });
// --- END PUSH NOTIFICATIONS ---- //

  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginModal = modal;
  });
  $scope.openLoginModal = function() {
    GAService.TrackPageVisited("Login Modal", "login");
    $scope.loginModal.show();
  };
  $scope.closeLoginModal = function() {
    $scope.loginModal.remove();
  };

  $scope.$on('modal.hidden', function() {
    if( UserService.username === null)
      $state.go('signup.find-your-neighborhood');
  });

  $scope.createProduct = function () {
    $ionicModal.fromTemplateUrl('templates/items/item-create.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then( function (modal) {
      $scope.createProductModal = modal;
      $scope.createProductModal.show();
    });
    
    //$state.go('item-create');
       
  };
  $scope.closeProductModal = function () {
    $scope.createProductModal.remove();
  };
  $scope.createShoutout = function (item) {
    $scope.shoutout = {type:'product'};
    $ionicModal.fromTemplateUrl('templates/shoutouts/create.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then( function (modal) {    
      $scope.createShoutoutModal = modal;  
      $scope.createShoutoutModal.show();
    });  
  };
  $scope.closeShoutoutModal = function () {
    $scope.createShoutoutModal.remove();
    $timeout(function() {$scope.createShoutoutModal.remove();}, 3000);
  };

  $scope.inviteNeighbors = function () {
    // handle social invite native functions
    console.log("invite");
    window.plugins.socialsharing.share("Come find out more about what I am borrowing and lending with my neighbors.", "Hey there, I'm using MyNeighbor.", null, "https://myneighbor.com");
  };



  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.loginModal.remove();
    $scope.createProductModal.remove();
    $scope.createRequestModal.remove();
    $scope.inviteNeighborsModal.remove();
    $scope.wouldYouModal.remove();
  });

  $scope.setItemBackground = function (imageUrl) {
    return { 'background-image': 'url(' + imageUrl + ')' };
  };

  $scope.getNeighborhood = function () {
    S2gApi
      .getNeighborhoodName(UserService.neighborhood, UserService.token)
      .then(
        function (data) {
          console.log(data);
          UserService.neighborhoodObj = data;
          SessionStorage.store(UserService);
        },
        function (reason) {
          console.log(reason);
        });
  };

  $scope.getUserData = function (callback) {
    S2gApi
      .getUserByName( UserService.username, UserService.token )
      .then(
        function (response) {
          console.log("response", response);
          UserService.neighborhood = response.neighborhood;
          UserService.userId = response.id;
          UserService.avatar = response.avatar;
          UserService.userData = response;
          SessionStorage.store(UserService);
          if (typeof callback === 'function') {
            callback(null, response);
          }
          $scope.getNeighborhood();
        },
        function (reason) {
          if (typeof callback === 'function') {
            callback(reason);
          }
          console.log(reason);
        });
  };

})

.controller('sideMenuCtrl', function($scope, $state) {
  'use strict';

  $scope.toggleMenuButton(true);

  //S2gApi.getItemOfTheWeek(UserService.username, UserService.password).then(

  $scope.itemOfTheWeek = fixtureRequest2;

  $scope.showItemsOfTheWeek = function() {
    $state.go('main.item-of-the-week');
  };

})

.controller('loginCtrl', function($scope, $steroids) {
  'use strict';

  $scope.facebookLoggedIn = false;//$steroids.addons.facebook.session.get().userID ? true : false;
  try {
    $steroids.addons.facebook.ready.then( function ()  {
      console.log('Facebook add-on ready!');
    });
    $steroids.addons.facebook.getLoginStatus().then( function (result) {
      console.log('logged in: ' + (result.status === 'connected'));
      console.log( JSON.stringify(result, null, 2) );
    });
  }
  catch (err) {
    console.log(err);  // running without steroids?
  }
});

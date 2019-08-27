// MyNeighbor Mobile App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ui.router', 'app.services', 'app.controllers', 'app.directives', 'app.s2gServices', 'app.filters', 'angularMoment'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  'use strict';
/*
  ionic.Platform.ready(function () {
    // The following will fail in the browser because
    // cordova.js is not available there.  You need
    // a custom steroids scanner for this to work on the 
    // handset.
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  });
*/
  // Manually set isFullScreen for plugin to work properly
  // Allows screen to resize/pan when keyboard is shown
  // Only activate on android platform

  if(ionic.Platform.platform() == 'android') {
    ionic.Platform.isFullScreen = true;
  }

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $httpProvider.interceptors.push('OAuth2_401_Interceptor');
  
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signup', {
    abstract: true,
    templateUrl: 'templates/start.html',//'<ion-nav-view></ion-nav-view>',
    controller: "SignUpCtrl",
  })
  .state('signup.intro', {
    url: '/intro',
    onEnter: function($state, UserService, ViewPersistanceStorage, GAService){
          var lastView = ViewPersistanceStorage.get();
          console.log($state, UserService, lastView);
          if(UserService.username && lastView && lastView !== 'undefined')
          {
            $state.go(lastView.stateName, lastView.stateParams);
          }
          else {
            if(UserService.username) {
            $state.go('main.home');
              }
          }
        },
    views: {
      'main-container': {
        controller: "intro.introCtrl",
        templateUrl: 'templates/intro/intro.html',
      }
    },   
  })
  .state('signup.find-your-neighborhood', {
    url: '/find-your-neighborhood',
    views: {
      'main-container': {
        templateUrl: 'templates/signup/find-your-neighborhood.html',
        }
      }
  })
  .state('signup.confirm-neighborhood', {
    url: '/confirm-neighborhood',
    views: {
      'main-container': {
      templateUrl: 'templates/signup/confirm-neighborhood.html',
      }
    }
  })

  .state('signup.neighborhood-lookup-error', {
    url: '/neighborhood-lookup-error/:type', //neighborhood or address;
    views: {
      'main-container': {
        controller: "errorCtrl",
        templateUrl: 'templates/signup/neighborhood-lookup-error.html',
      }
    }
  })

  .state('signup.create-your-account', {
    url: '/create-your-account',
    views: {
      'main-container': {
        templateUrl: 'templates/signup/create-your-account.html',
      }
    }
  })

  .state('signup.login', {
    url: '/login',
    views: {
      'main-container': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  // setup side menu
  .state('main', {
    url: '/main',
    abstract: true,
    controller: "sideMenuCtrl",
    templateUrl: 'templates/side-menu.html'
  })

  // .state('main.content' , {
  //   url: '/content',
  //   abstract: true,
  //   views: {
  //     'main-container': {
  //       templateUrl: 'templates/main-content.html'
  //     }
  //   }
  // })

  .state('main.about', {
    url: '/about',
    views: {
      'main-container': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('main.developer', {
    url: '/developer',
    views: {
      'main-container': {
        templateUrl: 'templates/developer.html',
        controller: 'developerCtrl'
      }
    }
  })


  .state('main.home', {
    url: '/home',
    views: {
      'main-container': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('main.neighborhood', {
    url: '/neighborhood',
    views: {
      'main-container': {
        templateUrl: 'templates/neighborhood/index.html',
        controller: 'neighborhood.indexCtrl'
      }
    }
  })

  .state('main.feed', {
    url: '/feed',
    views: {
      'main-container': {
        templateUrl:'templates/feed.html',
        controller: 'feedCtrl'
      }
    }
  })

  .state('main.items', {
    url: '/items/index/?type&scrollTop',//if mine set to type=mine - set scrollTop to true to forget scroll position
    views: {
      'main-container': {
        templateUrl: 'templates/items/index.html',
        controller: 'items.indexCtrl'
      }
    }
  })

  .state('main.item', {
    url: '/item/:id',
    views: {
      'main-container': {
        templateUrl: 'templates/items/item-show.html',
        controller: 'items.showCtrl'
      }
    }
  })
  .state('main.item-edit', {
    url: '/item-edit/:id',
    views: {
      'main-container': {
        templateUrl: 'templates/items/item-edit.html',
        controller: 'items.itemEditCtrl'
      }
    }
  })
  .state('main.invite', {
    url: '/invite',
    views: {
      'main-container': {
        templateUrl:'templates/invite.html',
        controller: 'inviteCtrl'
      }
    }
  })
  .state('main.shoutouts', {
    url: '/shoutouts/index/?type',//if mine set to type=mine
    views: {
      'main-container': {
        templateUrl: 'templates/shoutouts/index.html',
        controller: 'shoutouts.indexCtrl'
      }
    }
  })

  .state('main.shoutout', {
    url: '/shoutout/:id',
    views: {
      'main-container': {
        templateUrl: 'templates/shoutouts/show.html',
        controller: 'shoutouts.showCtrl'
      }
    }
  })
  .state('main.shoutout-edit', {
    url: '/shoutout-edit/:id',
    views: {
      'main-container': {
        templateUrl: 'templates/shoutouts/edit.html',
        controller: 'shoutouts.editCtrl'
      }
    }
  })

  .state('main.conversation', {
    url: '/conversation/:itemId/:replyId/:type',//type: item or shoutout
    views: {
      'main-container': {
        templateUrl: 'templates/conversation/conversation.html',
        controller: 'conversation.conversationCtrl'
      }
    }
  })
  

  .state('main.profile', {
    url: '/profile-show/:type',
    views: {
      'main-container': {
        templateUrl: 'templates/profile/show.html',
        controller: 'profile.showCtrl'
      }
    }
  })
  .state('main.profile-edit', {
      url: '/profile-edit/:type',//looking for 'view', edit' or 'new'
      views: {
        'main-container': {
          templateUrl: 'templates/profile/edit.html',
          controller: 'profile.editCtrl'
        }
      }
    })

  

  .state('profile', {
    abstract: true,
    templateUrl: 'templates/profile/create.html'
  })

  .state('profile.create', {
    url: '/profile/:type',//looking for 'view', edit' or 'new'
    views: {
      'main-container':{
        templateUrl: 'templates/profile/edit.html',
        controller: 'profile.editCtrl'
      }
    }
  })

  
  .state('main.item-of-the-week', {
    url: '/item-of-the-week',
    views: {
      'main-container': {
        templateUrl: 'templates/item-of-the-week.html',
        controller: 'itemOfTheWeekCtrl'
      }
    }
  })

  .state('wouldyou', {
    url: '/wouldyou/:type',
    templateUrl: 'templates/would-you.html',
    controller: 'wouldYouCtrl'
  });
  
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/borrow');
  $urlRouterProvider.otherwise("/intro");
})

.run( function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});

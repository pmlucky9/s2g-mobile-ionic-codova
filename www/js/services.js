angular.module('app.services', [])

.factory('YelpService', function($http, $q) {
  'use strict';
  var s2gUrl = 'https://api.myneighbor.com';

  return {
    getNeighborhood: function(address) {
      var d = $q.defer();
      console.log(address);

      $http({
        method: 'GET',
        url: s2gUrl + '/neighborhoods?address=' + encodeURIComponent(address)
      })
      .success( function (response) {
        d.resolve(response);
      })
      .error( function (reason) {
        d.reject(reason);
      });

      return d.promise;
    }
  };
})

.factory( '$steroids', function () {
  'use strict';
  /* jshint ignore:start */
  return steroids;
  /* jshint ignore:end */
})

.factory ( '$device', function () {
  'use strict';
  return function () {
      try {
      return device; // jshint ignore:line
    }
    catch (error) {
      console.log(error); // Running without Cordova?
      return null;
    }  
  };
})

.factory( '$moment', function () {
  'use strict';
  return moment; // jshint ignore:line
})

.factory( '$google', function () {
  'use strict';
  /* jshint ignore:start */
  return google;
  /* jshint ignore:end */
})

.factory( 'SessionStorage', function () {
  'use strict';
  return {
    store: function(UserService) {
      window.localStorage.setItem('userSession', JSON.stringify(UserService));
    },
    remove: function() {
      window.localStorage.removeItem('userSession');
    },
    get: function() {
      var userSession = window.localStorage.getItem('userSession');
      if (userSession) { return JSON.parse(userSession); }
      return null;
    }
  };
})

/*
  WouldYouStorage for saving Would You? sessions
 
  Example object:

  {
    lend: {
      // Don't show again tracker on intro screen
      showIntro: false,
      // Items user replied "yes" to
      interestItems: [{ sample object here }],
      // Questions in user's current session
      questions: [{ question object here }],
      // Index of current question for user
      questionIndex: 9
    },
    borrow: {
      // Same as above
    }
  }
*/
.factory( 'WouldYouStorage', function () {
  'use strict';
  return {
    store: function (wouldYou) {
      window.localStorage.setItem('wouldyouSession', JSON.stringify(wouldYou));
    },
    remove: function () {
      window.localStorage.removeItem('wouldyouSession');
    },
    get: function () {
      var wouldyouSession = window.localStorage.getItem('wouldyouSession');
      if (wouldyouSession) {
        return JSON.parse(wouldyouSession);
      }
      return {
        lend: {
          showIntro: true,
          interestItems: [],
          questions: [],
          questionIndex: 0
        },
        borrow: {
          showIntro: true,
          interestItems: [],
          questions: [],
          questionIndex: 0
        }
      };
    }
  };
})

.factory( 'ViewPersistanceStorage', function () {
  'use strict';
  return {
    store: function(view) {
      window.localStorage.setItem('lastView', JSON.stringify(view));
    },
    remove: function() {
      window.localStorage.removeItem('lastView');
    },
    get: function() {
      var lastView = window.localStorage.getItem('lastView');
      if (lastView) { return JSON.parse(lastView); }
      return null;
    }
  };
})

.factory( 'GAStorage', function () {
  'use strict';
  return {
    store: function(gainfo) {
      window.localStorage.setItem('GAStorage', JSON.stringify(gainfo));
    },
    remove: function() {
      window.localStorage.removeItem('GAStorage');
    },
    get: function() {
      var gainfo = window.localStorage.getItem('GAStorage');
      if (gainfo) { return JSON.parse(gainfo); }
      return null;
    }
  };
})

// Session storage of facebook properties loaded from facebook
// as part of a login or an account creation.
.factory( 'FacebookSessionProperties', function () {
  var props = {};
  return props; 
})
;
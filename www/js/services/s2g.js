
angular.module('app.s2gServices', [] )

.factory( 'OAuth2_401_Interceptor', function ($rootScope, $q) {
  'use strict';
  var OAuth2Exclusions = [
    'https://api.myneighbor.com/token'
    // 'http://10.0.0.2:8000/token'
    //'http://api-staging.myneighbor.com/token'
  ];
  return {
    'responseError': function (response) {
      console.log('OAuth2_401_Interceptor');
      console.log(response);
      console.log(_.find(OAuth2Exclusions, response.config.url));
      if (response && response.status === 401 && undefined === _.find(OAuth2Exclusions, function (c) { return c === response.config.url; }) ) {
         console.log('broadcasting s2g:401');
        $rootScope.$broadcast('s2g:401');
      }
      return $q.reject(response);
    }
  };
})

.factory('S2gApi', function ($q, $http) {
  'use strict';
  var s2gUrl = 'https://api.myneighbor.com';
  // var s2gUrl = 'http://10.0.0.2:8000';
  //TEMP
  //var s2gUrl = 'http://api-staging.myneighbor.com';
  var apiClient = window.btoa('officialApiClient:C0FFEE');

  return {
    version: function () {
      console.log('calling %s', s2gUrl + '/version');
      var d = $q.defer();
      $http({method: 'GET', url: s2gUrl + '/version'})
      // $http({method: 'GET', url: 'https://api.myneighbor.com/version'})
      .success(function (data /*, status, headers, config*/) {
        console.log('got something?');
        d.resolve(data);
      })
      .error(function (reason) {
        console.log('got an errror');
        d.reject(reason);
      })
      .catch ( function (reason) {
        d.reject(reason);
        console.log(reason);
      });
      return d.promise;
    },

    url: function () {
      return s2gUrl;
    },

    getAuthToken: function (email, password) {
      var d = $q.defer();
      $http({
        method: 'POST',
        url: s2gUrl + '/token',
        data: {
          grant_type: 'password', // jshint ignore:line
          username: email,
          password: password,
        },
        headers: {
          Authorization: 'Basic ' + apiClient
        }
      })
      .success( function (data) {
        d.resolve(data);
        console.log(data);
      })
      .error(function (reason) {
        d.reject(reason);
      })
      .catch(function (reason) {
        return d.reject(reason);
      });
      return d.promise;
    },

    getUserByName: function(username, token) {
      console.log('getUser', username, token);
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/accounts/' + username.replace(/\+/g,'%2B'),
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data.data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    createAccount: function (email, password, neighborhood, location, address) {
      var d = $q.defer();
      $http({
        method: 'POST',
        url: s2gUrl + '/accounts',
        data: {
          email: email,
          password: password,
          neighborhood: neighborhood,
          location:location,
          address: address
        }
      })
      .success(function (data) {
        d.resolve(data);
      })
      .error(function (reason) {
        d.reject(reason);
      })
      .catch(function (reason) {
        return d.reject(reason);
      });
      return d.promise;
    },

    registerDevice: function (username, token, bundleId, deviceId, type, deviceToken) { 
      var d = $q.defer();

      try {
        $http({
          method: 'PUT',
          url: s2gUrl + '/accounts/' + username.replace(/\+/g,'%2B') + '/devices/' + deviceId, 
          data: {
            bundle_id: bundleId,
            device_id: deviceId, // jshint ignore:line
            type: type,
            push_token: deviceToken, // jshint ignore:line
            active: true
          },
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    updateProfile: function (username, token, profile) {
      var d = $q.defer();

      try {
        $http({
          method: 'PUT',
          url: s2gUrl + '/accounts/' + username.replace(/\+/g,'%2B'),
          data: profile,
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        d.reject(error);
      }

      return d.promise;
    },

    getNeighboorhoodItems: function(neighborhood, token, query) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/neighborhoods/' + neighborhood + '/items?limit=300',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          },
          params: query
        })
        .success(function (response) {
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },
    getNeighborhoodName: function(neighborhood, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/neighborhoods/' + neighborhood,
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data.data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },
    getNeighborhoodTopUsers: function(neighborhood, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/neighborhoods/' + neighborhood + '/top-neighbors',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data.data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },
    getNeighborhoodTopItems: function(neighborhood, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/neighborhoods/' + neighborhood + '/top-items',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data.data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },
    getNeighborhoodatLocation: function(latLng){
      var d = $q.defer();
      $http({
        method: 'GET',
        url: s2gUrl + '/neighborhoods/' + latLng,
        
      })
      .success(function (data) {
        d.resolve(data.data);
      })
      .error(function (reason) {
        console.log('errors2g', reason);
        d.reject(reason);
      })
      .catch(function (reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getUploadedItems: function(username, token, query) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/items',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          },
          params: query
        })
        .success(function (data) {
          d.resolve(data.data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    getItem: function(itemId, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/items/' + itemId,
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    //TODO This is the same as the one above can we delete?
    getUploadedItem: function(params) {
      var d = $q.defer();
      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/items/' + params.itemId,
          headers: {
            Authorization: 'Bearer ' + params.userToken.access_token // jshint ignore:line
          }
        })
        .success(function (data) {
          d.resolve(data);
        })
        .error(function (reason) {
          d.reject(reason);
        })
        .catch(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(reason);
      }

      return d.promise;
    },

    // Get new Would you borrow? questions
    // query -> i.e. limit=5, exclude=abc123,123abc
    // type === 'lend' or 'borrow'
    getWouldyou: function (user, type, query) {
      var d = $q.defer();
      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/wouldyou/' + type,
          params: query,
          headers: {
            Authorization: 'Bearer ' + user.token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Save response to Would you borrow? question
    // questionId -> question.id, response -> true or false
    // type === 'lend' or 'borrow'
    saveWouldyouResponse: function (user, type, questionId, response) {
      var d = $q.defer();
      try {
        $http({
          method: 'PUT',
          url: s2gUrl + '/wouldyou/' + type + '/' + questionId,
          headers: {
            Authorization: 'Bearer ' + user.token.access_token // jshint ignore:line
          },
          data: { response: response }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    getPreferences: function (params) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/users/' + params.username.replace(/\+/g,'%2B') + '/preferences',
          headers: {
            Authorization: 'Bearer ' + params.token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    updatePreferences: function (username, token, preferences) {
      var d = $q.defer();

      try {
        $http({
          method: 'PUT',
          url: s2gUrl + '/users/' + username.replace(/\+/g,'%2B') + '/preferences',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          },
          data: preferences
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    getPrefCategories: function (params) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/users/' + params.username.replace(/\+/g,'%2B') + '/preferences/categories',
          headers: {
            Authorization: 'Bearer ' + params.token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    savePrefCategories: function(params) {
      var d = $q.defer();

      try {
        $http({
          method: 'PUT',
          url: s2gUrl + '/users/' + params.username.replace(/\+/g,'%2B') + '/preferences/categories',
          headers: {
            Authorization: 'Bearer ' + params.token.access_token // jshint ignore:line
          },
          data: {
            categories: params.categories
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    saveItemList: function(params) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/items',
          headers: {
            Authorization: 'Bearer ' + params.token.access_token // jshint ignore:line
          },
          data: params.item
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    getCategories: function () {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/categories'
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    saveItem: function(item, userToken) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/items',
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: item,
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    updateItem: function(item, userToken) {
      var d = $q.defer();

      try {
        $http({
          method: 'PUT', 
          url: s2gUrl + '/items/' + item.id,
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: item,
        })
        .success(function(response) {
          d.resolve('update', response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    deleteItem: function(item, userToken) {
      var d = $q.defer();
      try {
        $http({
          method: 'DELETE', 
          url: s2gUrl + '/items/' + item.id,
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: item,
        })
        .success(function(response) {
          d.resolve('update', response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    saveItemRequest: function (request, userToken, itemId) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/items/' + itemId + '/requests',
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: request
        })
        .success(function (response) {
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Get a request you made or for your item
    getRequest: function (userToken, itemId, requestId) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/items/' + itemId + '/requests/' + requestId,
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          }
        })
        .success(function (response) {
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Get a reply and all related messages
    getConversation: function (userToken, requestId) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/requests/' + requestId,
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          }
        })
        .success(function (response) {
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },
    //reply to a conversation
    postMessage: function (userToken, requestId, message) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/requests/' + requestId + '/message',
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: message
        })
        .success(function (response) {
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Get a shoutout request for your neighborhood
    getNeighborhoodShoutout: function (userToken, neighborhoodId, shoutoutId) {
      var d = $q.defer();
      try  {
        $http({
          method: 'GET',
          url: s2gUrl + '/neighborhoods/' + neighborhoodId + '/shoutouts/' + shoutoutId,
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          }
        })
        .success(function (response) {
          console.log('getShoutout', response);
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    saveNeighborhoodShoutout: function(shoutout, userToken) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/neighborhoods/' + shoutout.neighborhood + '/shoutouts',
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: shoutout,
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    updateNeighborhoodShoutout: function(shoutout, userToken) {
      var d = $q.defer();

      try {
        $http({
          method: 'PUT',
          url: s2gUrl + '/neighborhoods/' + shoutout.neighborhood + '/shoutouts/' + shoutout.id,
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: shoutout,
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Remove a neighborhood shoutout
    removeNeighborhoodShoutout: function (shoutoutId, user) {
      var d = $q.defer();

      try {
        $http({
          method: 'DELETE',
          url: s2gUrl + '/neighborhoods/' + user.neighborhood + '/shoutouts/' + shoutoutId,
          headers: {
            Authorization: 'Bearer ' + user.token.access_token // jshint ignore:line
          }
        })
        .success(function (response) {
          d.resolve(response);
        })
        .error(function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Get all shout out requests in the neighborhood
    getNeighborhoodShoutouts: function (neighborhood, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/neighborhoods/' + neighborhood + '/shoutouts',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(reason);
      }

      return d.promise;
    },

    // Save a reponse to a shoutout
    saveShoutoutRequest: function(shoutout, request, userToken) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/neighborhoods/' + shoutout.neighborhood + '/shoutouts/' + shoutout.id + '/requests',
          headers: {
            Authorization: 'Bearer ' + userToken.access_token // jshint ignore:line
          },
          data: request,
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Get all neighbor requests for my items
    getNeighborRequests: function (username, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/users/' + username.replace(/\+/g,'%2B') + '/neighbor-requests',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },
    
    getMyRequests: function (username, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/users/' + username.replace(/\+/g,'%2B') + '/my-requests',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        }); 
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    getInbox: function(username, token){
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/users/' + username.replace(/\+/g,'%2B') + '/inbox',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // ATM, returns unseen requests with related items
    getActivityFeed: function (username, token) {
      var d = $q.defer();

      try {
        $http({
          method: 'GET',
          url: s2gUrl + '/users/' + username.replace(/\+/g,'%2B') + '/activity',
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Mark a request from activity feed as 'removed' so it doesn't show up in feed
    removeFeedRequest: function (username, token, requestId) {
      var d = $q.defer();

      try {
        $http({
          method: 'DELETE',
          url: s2gUrl + '/users/' + username.replace(/\+/g,'%2B') + '/activity/request/' + requestId,
          headers: {
            Authorization: 'Bearer ' + token.access_token // jshint ignore:line
          }
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Uploading images to the server using a simple HTTP multi-part POST request
    // ($http.post of the FormData) DOESN'T work on Cordova,
    // and specific Cordova API is used instead - FileTransfer
    // https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md
    saveItemImage: function(updateImage, userToken) {
      var d = $q.defer();

      try {
        var options = new FileUploadOptions();
        options.fileKey = "image";
        options.headers = { 'Authorization' : 'Bearer ' + userToken.access_token };
        options.params = { width: updateImage.width, height: updateImage.height };

        var ft = new FileTransfer();
        ft.upload(updateImage.deviceImageURI, encodeURI(s2gUrl + '/images'),
          function(response) {
            d.resolve(JSON.parse(response.response).data.image);
          },
          function(reason) {
            d.reject(reason);
          },
          options);
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    facebookLogin: function(facebookCreds) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/identity-providers/facebook',
          data: facebookCreds,
        })
        .success(function(response) {
          d.resolve(response);
        })
        .error(function(reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    neighborhoodLookupError: function(options) {
      var d = $q.defer();

      d.resolve();

      /* $http({
        method: 'POST',
        url: s2gUrl + '/neighborhood-lookup-error',
        data: options,
      })
      .success(function(response) {
        d.resolve(response);
      })
      .error(function(reason) {
        d.reject(reason);
      }); */

      return d.promise;
    },

    retrieveNeighborhoodId: function(options) {
      var d = $q.defer();

      d.resolve();
      // d.reject();

      /* $http({
        method: 'POST',
        url: s2gUrl + '/retrieve-neighborhood-id',
        data: options,
      })
      .success(function(response) {
        d.resolve(response);
      })
      .error(function(reason) {
        d.reject(reason);
      }); */

      return d.promise;
    },

    /*
      DEVELOPER ROUTES
    */
    clearWouldYouQuestions: function (user) {
      var d = $q.defer();

      try {
        $http({
          method: 'DELETE',
          url: s2gUrl + '/developers/wouldyouquestions',
          headers: {
            Authorization: 'Bearer ' + user.token.access_token // jshint ignore:line
          }
        })
        .success( function (response) {
          d.resolve(response);
        })
        .error( function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    },

    // Send analytic data
    sendAnalytics: function (user, events) {
      var d = $q.defer();

      try {
        $http({
          method: 'POST',
          url: s2gUrl + '/analytics/events',
          headers: {
            Authorization: 'Bearer ' + user.token.access_token // jshint ignore:line
          },
          data: {
            events: events
          }
        })
        .success( function (response) {
          d.resolve(response);
        })
        .error( function (reason) {
          d.reject(reason);
        });
      }
      catch (error) {
        return d.reject(error);
      }

      return d.promise;
    }
  };
});

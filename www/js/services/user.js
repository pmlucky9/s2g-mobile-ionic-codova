angular.module('app.s2gServices' )

.factory('UserService', function (SessionStorage) {
  'use strict';

  var service = {
    username: null,
    password: null,
    userId: null,
    token: null,
    neighborhood: null,
    userData: {},
    neighborhoodObj: null,

    logout: function () {
      this.username = null;
      this.password = null;
      this.userId = null;
      this.token = null;
      this.neighborhood = null;
      this.neighborhoodObj = {};
      this.userData = {};
    },

    setSession: function (userSession) {
      this.username = userSession.username;
      this.password = userSession.password;
      this.userId = userSession.userId;
      this.token = userSession.token;
      this.neighborhood = userSession.neighborhood;
      this.neighborhoodObj = userSession.neighborhoodObj;
      this.userData = userSession.userData;
    }
    
  };

  var session = SessionStorage.get();
  if (session) {
    console.log('LOADING SESSION');
    service.setSession(session);
  }

  return service;
});

describe('[Unit]: UserService', function () {
  'use strict';
  beforeEach( module('app.s2gServices'));
  describe('userService', function () {

    var userService;

    beforeEach( inject(function($injector) {
      userService = $injector.get('UserService');
    }));

    it('has username, password, userId and token properties', function() {
      expect(userService.username).toBe(null);
      expect(userService.password).toBe(null);
      expect(userService.userId).toBe(null);
      expect(userService.token).toBe(null);
    });

    it('clears all properties when logged out', function() {
      userService.username = 'hi';
      userService.token = 'hi';
      userService.password = 'p';
      userService.userId = 'id';
      userService.logout();
      expect(userService.username).toBe(null);
      expect(userService.password).toBe(null);
      expect(userService.userId).toBe(null);
      expect(userService.token).toBe(null);
    });

  });
});
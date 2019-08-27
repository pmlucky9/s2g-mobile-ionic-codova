describe('[Unit]: s2gServices', function () {
  'use strict';
  
  beforeEach( module('app.s2gServices') );

  describe( 's2gApi', function () {

    var s2gApi;

    beforeEach( inject( function ($injector) {
      s2gApi = $injector.get('S2gApi');
    }));

    describe( 'version', function () {

      var resolvedValue, httpBackend;

      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.expect('GET', 'https://api.myneighbor.com/version')
          .respond(200, { version: '0.0.0'} );

        s2gApi.version().then( function (keys) {
          resolvedValue = keys;
        });

        httpBackend.flush();
      }));

      afterEach( function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

      //test
      it ('should GET https://api.myneighbor.com/version', function () {
        expect(resolvedValue.version).toBe('0.0.0');
      });

    });

    describe( 'createAccount', function () {
      var resolvedValue, httpBackend;
      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.expect('POST', 'https://api.myneighbor.com/accounts')
          .respond(200, { status: 'success'} );

        s2gApi.createAccount().then( function (keys) {
          resolvedValue = keys;
        });

        httpBackend.flush();
      }));

      afterEach( function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

      //test
      it ('should POST https://api.myneighbor.com/accounts', function () {
        expect(resolvedValue.status).toBe('success');
      });
    });

    describe( 'updateProfile', function () {
      var resolvedValue, httpBackend;
      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.expect('PUT', 'https://api.myneighbor.com/users/user@test.lan')
          .respond(200, { status: 'success'} );

        s2gApi.updateProfile('user@test.lan', {access_token: 'token'}).then( function (keys) {
          resolvedValue = keys;
        });

        httpBackend.flush();
      }));

      afterEach( function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

      //test
      it ('should PUT https://api.myneighbor.com/updateProfile', function () {
        expect(resolvedValue.status).toBe('success');
      });
    });

    describe( 'getAuthToken', function () {
      var resolvedValue, httpBackend;
      beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.expect('POST', 'https://api.myneighbor.com/token')
          .respond(200, { status: 'success'} );

        s2gApi.getAuthToken('user@test.lan', '123').then( function (keys) {
          resolvedValue = keys;
        });

        httpBackend.flush();
      }));

      afterEach( function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

      //test
      it ('should POST https://api.myneighbor.com/token', function () {
        expect(resolvedValue.status).toBe('success');
      });     
    });
  });

});

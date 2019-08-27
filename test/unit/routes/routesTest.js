/**
 *  Route testing consists of setting up the templates
 *  and ensuring that state transitions load the right ones
 *  at the right time.
 */
describe('[Unit] Routes', function () {
  'use strict';
  beforeEach(module('app'));

  describe('Signup flow', function () {

    // Add all templates needed in here.  Karma.conf.js
    // has special treatment to create loadable modules
    // out of the html fragments.
    var templates = [
      'templates/find-your-neighborhood.html',
      'templates/start.html'
    ];

    //  load the templates up.
    templates.forEach(function (template) {
      beforeEach(module(template));
    });

    var scope, SignUpCtrl;

    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      SignUpCtrl = $controller('SignUpCtrl', {
        $scope: scope
      });
    }));

    describe( 'Find your neighborhood', function () {

      it('should transition to signup.find-your-neighborhood', inject(function ($httpBackend, $state, $rootScope) {
        $httpBackend.expect('GET', 'https://api.myneighbor.com/version')
          .respond(200, {status: 'success'});
        $state.transitionTo('signup.find-your-neighborhood');
        $rootScope.$apply();
        expect($state.current.name).toBe('signup.find-your-neighborhood');
      }));

    });

  });

});

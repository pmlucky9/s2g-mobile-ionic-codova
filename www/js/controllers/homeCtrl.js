angular.module('app.controllers')

.controller('homeCtrl', function($scope, $state, $rootScope) {
  'use strict';

  $rootScope.$viewHistory.backView = null;


  $scope.toggleMenuButton(true);

  $scope.items = {
    headline: 'Howdy, Neighbor!',
    first: {
      intro:'Browse your neighborhood',
      buttons:[{
        label:'Offers',
        target:'main.items'
      }, {
        label:'Requests',
        target:'main.shoutouts'
      }]
    },
    second: {
      intro:'What would you offer?',
      text:'Ideas for items and services you would offer your neighborhood.',
      buttons:[{
        label:'Browse Suggestions',
        target:'wouldyou({type:"lend"})'
      }],
      image:'/img/home/wouldyou-dark-200x300.jpg'
    },
    third: [{
      headline:'Send an invitation',
      text: 'Share the love', 
      icon:'ion-android-add-contact',
      target:'main.invite'
    },{
      headline:'Tell us what you think',
      text: 'Take a short survey', 
      icon:'ion-compose',
      target:''
    }]
  };


});
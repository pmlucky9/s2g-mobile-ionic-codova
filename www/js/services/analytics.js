angular.module('app.s2gServices')

.factory('AnalyticsService', function (S2gApi, UserService) {
  'use strict';

  return {
    // Send performance data to API to store in Big Query
    // name -> string, event name
    // data -> object of performance times
    sendPerformance: function (name, data) {
      var event = {
        userId: UserService.userId,
        neighborhoodId: UserService.neighborhood,
        event: name,
        ts: new Date().valueOf(),
        properties: JSON.stringify(data)
      };

      S2gApi
        .sendAnalytics(UserService, [event])
        .then( function (response) {
          console.log(response);
        }, function (reason) {
          console.log(reason);
        });
    }
  }
});
angular.module('app.s2gServices')

.factory('GAService', function() {
  'use strict';

  function nativePluginErrorHandler (result) {
    console.log('nativePluginResultHandler: '+result)
  }

  function nativePluginResultHandler (result) {
    console.log('nativePluginResultHandler: '+result);
  }

  function setDimensions(data) {
    if (!window.plugins.gaPlugin || !window.plugins.gaPlugin) {
      console.log('No GAPlugin, skipping setDimensions');
      return;
    }

    // Note that when setting the Dimensions from within the app dynamically, there is a slight delay between when you call
    // the function to set the dimension, and when the dimension is actually changed. If you need to send out custom data
    // inside a dimension for a giving tracking call, do so with a small delay added on to ensure the dimension is changed.
    //
    // Dimensions are set in the Google Analytics Administration Panel and each slot is assigned one name

    //  userID
    if(data.username) {
      window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 1, data.username);
    }

    // anonymousId
    if(data.anonymousId) {
      window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 2, data.anonymousId);
    }
    // neighborhoodId
    if(data.neighborhood) {
      window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 3, data.neighborhood);
    }

    // bundleId
    window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 4, "345");

    // appVersion  ( Already provided by Google API )
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 5, "");

    // userAgent
    var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    
    window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 6, deviceType);

    // IP
    steroids.device.getIPAddress({}, {
      onSuccess: function(message) {
        window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 7, message.ipAddress);
      }
    });
    
    // locale
    navigator.globalization.getLocaleName(
      function (locale) {
        window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 8, locale.value);
      },
      function () {
        console.log('Error getting locale\n');
      }
    );

    // traits
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 9, "");

    // properties
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 10, "");

    // page
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 11, "");

    // pageName
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 12, "");

    // cdvInfo
    window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 13, device.cordova);

    // network
    window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 14, navigator.connection.type);

    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 15, "");
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 16, "");
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 17, "");
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 18, "");
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 19, "");
    // window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 20, "");
  }

  var gaScope = null;

  var service = {

    initialize: function (gainfo, scope) {
      if (!window.plugins || !window.plugins.gaPlugin) {
        console.log('No GAPlugin, skipping init.');
        return;
      }
      gaScope = scope;
      var that = this;
      setDimensions(gainfo);
      window.plugins.gaPlugin.init(nativePluginResultHandler, nativePluginErrorHandler, "UA-53648357-2", 10);
    },

    nativePluginResultHandler: function  (result) {
      //alert('nativePluginResultHandler - '+result);
      console.log('nativePluginResultHandler: '+result);

    },

    nativePluginErrorHandler:  function  (error) {
      //alert('nativePluginErrorHandler - '+error);
      console.log('nativePluginErrorHandler: '+error);
    },

    TrackPageAction: function (category, eventName, label, val, options) {
      console.log("GAService Track : Page Action - ", category, eventName, label, val, options );
      if (!window.plugins || !window.plugins.gaPlugin) {
        return;
      }
      // setDimensions();
      window.plugins.gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, category, eventName, label , 1);
    },

    TrackPageVisited: function (pageTitle, cat) {
      console.log("GAService Track : Page Visited - " + pageTitle );
      cat = typeof cat !== 'undefined' ? cat : "root";
      if (!window.plugins || !window.plugins.gaPlugin) {
        return;
      }
      window.plugins.gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, pageTitle,  "Page Viewed", cat , 1);
    },

    // TrackButtonClicked: function () {
    //   window.plugins.gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Button", "Click", "event only", 1);
    // },
        
    // VariableButtonClicked: function () {
    //   // Set a dimension based on index and value. Make sure you have added a dimension in the GA dashboard to the
    //   // default property for the passed in index, and your desired scope. GA allows up to 20 dimensions for a free account
    //   window.plugins.gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 1, "Purple");

    //   // dimensions are are passed to the next event sent to GA. go ahead and fire off an event with the label (key) of your choice
    //   // In this example, the label for custom dimension 1 will show up in the dashboard as "favoriteColor". This is much more efficent
    //   // than the old custom variable method introduced in V1, (plus you get 20 free dimensions vs 5 free custom variables)
    //   window.plugins.gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "event with variable", "set variable", "favoriteColor", 1);
    // },
        
    // PageButtonClicked: function () {
    //   window.plugins.gaPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, "some.url.com");
    // },

    goingAway: function () {
      if (!window.plugins || !window.plugins.gaPlugin) {
        return;
      }      
      window.plugins.gaPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
    }

  };

  return service;
});
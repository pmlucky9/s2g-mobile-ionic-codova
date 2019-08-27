var onNotification = function(e) {
  angular.element(document.getElementsByTagName('body')[0]).injector().get('PushService').onNotification(e);
}
var onNotificationAPN = function(e) {
  angular.element(document.getElementsByTagName('body')[0]).injector().get('PushService').onNotificationAPN(e);
}

angular.module('app.s2gServices')

.factory('PushService', function() {
  'use strict';

  var service = {
    pushNotification: null,
    pushToken: '',
    pushScope: null,

    initPushPlugin: function(scope) {
      console.log("Initializing Push Service");
      try {
        this.pushNotification = window.plugins.pushNotification;
        this.pushScope = scope;
        // Register this device generically (not bound to user)
        console.log("registering " + device.platform + ".");
        if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos') {
          // Andrew's senderID 121729986235
          this.pushNotification.register(this.successHandler, this.errorHandler, {
            "senderID": "1004475995667",
            "ecb": "onNotification"
          }); // required!
        } else {
          this.pushNotification.register(onNotificationAPN, this.errorHandler, {
            "badge": "true",
            "sound": "true",
            "alert": "true",
            "ecb": "onNotificationAPN"
          }); // required!
        }
      } catch (err) {
        var txt = "There was an error on this page.\n\n";
        txt += "Error description: " + err.message + "\n\n";
        console.log(txt);
      }
    },

    // handle APNS notifications for iOS
    onNotificationAPN: function(e) {
      console.log('inside onNotificationAPN:', e);
      if (typeof e == 'string') {
        console.log('token: ' + e);
        this.pushToken = e;
        return;
      }

      if (!e.aps) {
        console.log('notification does not have aps property.');
        return;
      }

      if (e.aps.alert) {
        console.log(e);
        console.log("push-notification: " + e.alert);
        // showing an alert also requires the org.apache.cordova.dialogs plugin
        // navigator.notification.alert(e.alert);
      }

      if (e.foreground === '1' && e.aps.sound) {
        steroids.audio.play('audio/doorbell.m4a');
        // playing a sound also requires the org.apache.cordova.media plugin
        // var snd = new Media(e.sound);
        // snd.play();
      }

      if (e.aps.badge) {
        this.pushNotification.setApplicationIconBadgeNumber(this.successHandler, e.badge);
      }

      this.pushScope.$broadcast('s2g:push', e);
    },


    // handle GCM notifications for Android
    onNotification: function(e) {
      console.log('EVENT -> RECEIVED:' + e.event);

      switch (e.event) {
        case 'registered':
          if (e.regid.length > 0) {
            console.log('REGISTERED -> REGID:' + e.regid);
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
            this.pushToken = e.regid;
          }
          break;

        case 'message':
          // if this flag is set, this notification happened while we were in the foreground.
          // you might want to play a sound to get the user's attention, throw up a dialog, etc.
          this.pushScope.$broadcast('s2g:push', e);
          if ( e.foreground ) {
            // ** Disabling because of https://github.com/MyNeighbor/s2g-mobile/issues/114
            // var snd = new Media("file://" + steroids.app.absolutePath + "/audio/doorbell.m4a", 
            //   function () { 
            //     console.log('successfully creating Media'); 
            //   }, 
            //   function (err) { 
            //     console.log('error creating Media:', err); 
            //   });
            // snd.play();
            console.log( '--INLINE NOTIFICATION--' );
          } else if ( e.coldstart ) {
            console.log( '--COLDSTART NOTIFICATION--' );
          } else {
            console.log( '--BACGROUND NOTIFICATION--' );
          }

          console.log('MESSAGE -> MSG: ' + e.payload.message);
          //android only
          console.log('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
          //amazon-fireos only
          console.log('MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp);
          break;

        case 'error':
          console.log('ERROR -> MSG:' + e.msg);
          break;

        default:
          console.log('EVENT -> Unknown, an event was received and we do not know what it is');
          break;
      }
    },

    tokenHandler: function(result) {
      alert(JSON.stringify(result));
      console.log('token: ' + result);
      this.pushToken = result;
      // Your iOS push server needs to know the token before it can push to this device
      // here is where you might want to send it the token for later use.
    },

    successHandler: function(result) {
      console.log('success:' + result);
    },

    errorHandler: function(error) {
      console.log('error:' + error);
    }


  };

  return service;
});

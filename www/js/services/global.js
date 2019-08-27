angular.module('app.s2gServices')
 
.factory('locationService', ['$google', '$q',
  function($google, $q){
    'use strict';
    var getLocation = function(address){
      var d = $q.defer();
        var geocoder = new $google.maps.Geocoder();
        geocoder.geocode({address: address}, function(result, status) {
          //console.log ( JSON.stringify(result, null, 2) );
          if (status === 'OK') {
            d.resolve(result);
          } else {
            d.reject(status);
          }
        });
        return d.promise;
    };
    var getDistance = function(locA, locB){
      return $google.maps.geometry.spherical.computeDistanceBetween(
        new $google.maps.LatLng(locA.lat, locA.lng), new $google.maps.LatLng(locB.lat, locB.lng), 3963.19
        );
    };

    return {
      getLocation: getLocation,
      getDistance: getDistance
    };

  }
])

.factory('neighborhoodSince', function() {
  'use strict';
  return {
    timeOptions: [
      'less than one year',
      'one year',
      'two years',
      'three years',
      'four years',
      'five years',
      'six years',
      'seven years',
      'eight years',
      'nine years',
      'ten years',
      'more than ten years'
    ],
    maxYears: 10,
    inYears: function(date){
      var today = moment(new Date());
      var since = moment(date);
      var timePassed = today.diff(since, 'years');
      if (timePassed > this.maxYears ){
        return this.timeOptions[this.maxYears + 1];
      } else {
        return this.timeOptions[timePassed];
      }  
    }
  };

})

.factory('defaultImages', function() {
  'use strict';
  return {
    male: '../img/defaultProfile_man_m.png',
    female:'../img/defaultProfile_woman_m.png',
    profile: '../img/defaultProfile_man_m.png',
    item: '../img/defaultImage_square.png'
  }
})

.factory('wouldYouTile', function() {
  'use strict';
  return {
    lend: {
      name: 'Ideas for you',
      rate: "Would you LEND?",
      image: "http://cdn2.business2community.com/wp-content/uploads/2013/10/neighborhood.jpg.jpg",
      id:"WouldYou"
    },
    borrow:{
      name: 'Ideas for you',
      rate: "Would you BORROW?",
      image: "http://cdn2.business2community.com/wp-content/uploads/2013/10/neighborhood.jpg.jpg",
      id:"WouldYou"
    }
  };
})

.factory('itemCache', function($cacheFactory){
  'use strict';
  return $cacheFactory('itemCache');
})
//used to update (add,edit,delete) items from the itemCache
.factory('updateCache', function(itemCache, $q){
  'use strict';
  
  var removeItem = function(itemId, array, replaceWith){
    for (var i=0; i<array.length; i++){
      if(array[i].id === itemId){
        if(replaceWith){
          array.splice(i, 1, replaceWith);
        } else {
          array.splice(i, 1);
        }
        break;
      }
    }
  }
  
  return {
    update: function(item, type) {
      var d = $q.defer();
      var result = {};
      //on item update, update the current item
      var c = {};
      var allCache = itemCache.get('all');
      var myCache = itemCache.get('mine');
      var currentItem = itemCache.get('current');
      currentItem.item = item;
      itemCache.put('current', currentItem);
      if (!allCache) {
        //nothing for now
      } else {
        if (type == "update"){
        removeItem(item.id, allCache, item);
        } else {
        removeItem(item.id, allCache);
        }
      }
      if (!myCache) {
        //nothing for now
      } else {
        //update the cache
        if(type == "update"){
        removeItem(item.id, myCache, item);
        } else {
        removeItem(item.id, myCache);  
        }
      }
      d.resolve(result);
      return d.promise;
    },
    add: function(item) {
      var d = $q.defer();
      var result = {};
      var allCache = itemCache.get('all');
      var myCache = itemCache.get('mine');
      //if allCache exists update it
      if (!allCache){
        //do nothing for now
      } else {
        //add new item to beginning of array
        allCache.unshift(item);
      }
      //if myCache exists, update it
      if (!myCache){
        //nothing for now
      } else {
        //add item to beginning of array
        myCache.unshift(item);
        //update timestamp for my items only
        itemCache.put('mineTimestamp', new Date());
      }

      d.resolve(result);
      return d.promise;
    }
  }

});

        
angular.module('app.controllers')

.controller('items.indexCtrl', function($scope, $state, S2gApi, AnalyticsService, UserService, $stateParams, $filter, $device, $window, $ionicScrollDelegate, wouldYouTile, itemCache, $timeout, GAService) {
  'use strict';


  $scope.toggleMenuButton(true);
  $scope.contentLoaded = false;
  $scope.stopLoading = false;
  $scope.searchQuery = itemCache.get('searchQuery');
  var viewType = $scope.viewType = $stateParams.type; //if my items type=mine
  if (viewType == null) {
    viewType = 'all';
    $scope.viewType = 'all';
  }
  $scope.wouldYouType = ( viewType === 'mine' ? 'lend' : 'borrow' );
  $scope.pageTitle = (viewType === "mine") ? "My Items" : "Borrow";
  $scope.currentUser = UserService;

  // Track Page View
  if(viewType === "mine") {
    GAService.TrackPageVisited("My Items");
  } else {
    GAService.TrackPageVisited("Borrow");
  }

  var delegate = $ionicScrollDelegate.$getByHandle('itemScroll');

  var completeUpdate = function(forgetPosition){
    //add would you tile
    $scope.items.push(wouldYouTile[$scope.wouldYouType]);
    //hides ionic refresh image
    $scope.$broadcast('scroll.refreshComplete');
    //hides Loading div
    $scope.contentLoaded=true;
    //cache the items and the current time so we can trigger a refresh later
    var timestamp = viewType + "Timestamp";
    itemCache.put(viewType, $scope.items);
    itemCache.put(timestamp, new Date());   
    //if coming from create Page from pull to refresh - we stay at the top
    if ($stateParams.scrollTop) {forgetPosition = true};
    if(!forgetPosition){
      delegate.scrollToRememberedPosition();
    }
  }

  $scope.updateItems = function(forgetPosition){
    if (viewType === "mine"){
      S2gApi.getUploadedItems(UserService.username, UserService.token, $scope.query)
      .then( function (data) {       
        $scope.items = $filter('orderBy')(data, 'lastUpdated', true);
        completeUpdate(forgetPosition);
      }, function (error) {
        console.log(error);
      });
    } else {
      S2gApi.getNeighboorhoodItems(UserService.neighborhood, UserService.token, $scope.query)
      .then( function (response) {
        $scope.items = response.data.items;
        completeUpdate(forgetPosition);
        
      }, function (error) {
        console.log(error);
      }); 
    }
  }
  $scope.loadItems = function(){
    //clear any single item cache
    itemCache.remove('current');
    //load from the cache if it exists
    var cache = itemCache.get(viewType);
    if(!cache || $stateParams.refresh){
      $scope.updateItems(); 
    } else {
      $scope.items = itemCache.get(viewType);
      $scope.contentLoaded=true;
      var timestamp = viewType + "Timestamp";
      var cachedTime = itemCache.get(timestamp);
      var now = new Date(); 
      //if coming from create Page we stay at the top
      if(!$stateParams.scrollTop){
        //without the timeout we get an error in the console telling us that we are calling the scroll before the dom is loaded.
          $timeout(function(){
            delegate.scrollToRememberedPosition();
          }, 1000);
      }
      //if it has been 5 minutes since we loaded the cache we refresh the data;      
      if (now - cachedTime > 300000) {
        $scope.contentLoaded=false;
        $scope.updateItems();       
      } 
      
    }
  };

  $scope.loadItems();
  
  //used in the collection repeat call 
  $scope.getItemHeight = function() {
    //Height is 50% of the width (image) + 23px(item title) + 20px(price) + 9px(top/bottom padding);
    return ($window.innerWidth / 2) + 53;
  };

  $scope.showItem = function (itemId) {
    if (itemId == "WouldYou"){
      $scope.$broadcast('loadWouldYou');
      $state.go('wouldyou', { type: $scope.wouldYouType });
    } else {
    $scope.toggleMenuButton(false);
    itemCache.put('searchQuery', $scope.searchQuery);
    setTimeout(function () {
      $state.go('main.item', {id: itemId});
    }, 200);
    }
  };

});
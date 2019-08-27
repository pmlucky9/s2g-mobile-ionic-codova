angular.module('app.directives')
  /*
    Directive to add google map to a div
    USAGE:
    <div map-canvas="location.object" geojson="geojson(string)" page=""></div>
    -> location.object = {lat:-12.456, lng:41.234}
    -> use page to specialize sizing etc per instance

  */
  .directive('mapCanvas', function ($google, $ionicLoading, S2gApi, $window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        mapCanvas: '=',
        geojson: '=',
        fullscreen: '=',
        page: '='
      },
      link: function (scope, element, attrs) {
        var page = attrs.page;
        if (page == 'neighbor'){
          //on neighborhood page we watch for changes in fullscreen attribute
          //we adjust the size of the container elements and then redraw the map - to ensure proper positioning
          scope.$watch(attrs.fullscreen, function(newValue){    
              var lat = scope.mapCanvas.lat;
              var lng = scope.mapCanvas.lng;
              var fullscreen = newValue;
              if (fullscreen === false){
                element.parent().css('height', 225);//accomodate button
                element.css('height', 200);
              } else {
                height = $window.innerHeight - (3*44);//header and footer + space to accomodate settings bar;
                element.parent().css('height',height);
                element.css('height', height-25);//accomodate button           
              }
              $timeout(function(){
                makeMap(lat, lng, fullscreen,attrs.page);  
              }, 500);                 
            })
        } else { 
          //on the confirm page we just watch for the lng/lat attributes to be loaded
          scope.$watch(scope.mapCanvas, function() {      
            var lat = scope.mapCanvas.lat;
            var lng = scope.mapCanvas.lng;
            var fullscreen = attrs.fullscreen;
            makeMap(lat,lng,fullscreen,page);
          });
        }
        var makeMap = function(lat,lng,fullscreen,page){
        var styles = [
            {
              stylers: [
                { hue: '#84A988' },
                { saturation: -20 }
              ]
            },{
              featureType: 'road',
              elementType: 'geometry',
              stylers: [
                { lightness: 100 },
                { visibility: 'simplified' }
              ]
            },{
              featureType: 'road',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ];

        var styledMap = new $google.maps.StyledMapType(styles,{name: 'Styled Map'});
        
        var map = new $google.maps.Map(element[0], {
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            zoomControl: false,
            streetViewControl: false,
            mapTypeIds: [$google.maps.MapTypeId.ROADMAP, 'map_style'],
            center: new $google.maps.LatLng(lat, lng),
            zoom: 13
          });
             
          map.mapTypes.set('map_style', styledMap);
          map.setMapTypeId('map_style');
          
          $google.maps.event.addListenerOnce(map, 'idle', function(){
            var parentHeight = element.parent()[0].offsetHeight; //height of parent element

            if (fullscreen === false){
              myHeight = 200;        
            } else {
              if(page == "neighbor"){
              myHeight = parentHeight - 25; //if fullscreen & on neighbor page we account for the expand button
             } else {
              myHeight = parentHeight; 
             }  
            }
            element.css('height', myHeight);  
            map.data.setStyle({
              fillColor: 'green',
              strokeWeight: 3,
              strokeColor: 'green'
            });
            map.data.loadGeoJson(S2gApi.url() + scope.geojson);
            var marker = new $google.maps.Marker({
              position: new $google.maps.LatLng(lat, lng),
              map: map
            }); 
                   
            element.parent().removeClass("loading"); // remove loading class, make visible 
            $google.maps.event.trigger(map, "resize"); //this is necessary to get proper placement of the marker          
          });

        }
      }
    }
  });

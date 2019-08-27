angular.module('app.directives')
  /*
    Directive to add overlay to sample images and to set images as backgrounds
    USAGE:
    <sample-filter item="item" data-class="image"></sample-filter>
    -> Pass image url in to set src on image
    -> Set data-class to any classes you'd like added to underlying div
    -> If directive is not in a repeater, you must wait for data to load
      before inserting element into DOM. Can be accomplished by
      setting ng-if="item.image"
  */
  //item images
  .directive('imageFilter', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/partials/image-filter.html',
      link: function (scope, element, attrs) {
          //check for "samples" and add overlay 
          var image = attrs.image;
          var reg = /s2g-images\/samples\//;
          var children = element.children().addClass(attrs.class);
          // Test if image is a sample image
          if (reg.test(image)) {
            children.addClass('sample-overlay');
          }       
          var bgimage = 'url("' + image + '"), url("../img/defaultImage_square.png")';
          element.children().css('background-image', bgimage);
      }
    }
  })
  /*
  profile and non-overlay images
  USAGE:
  <div class="square-image" back-image="{{ item.image }}" type="item" /></div>
  -- see images.scss for class options
  -- back-image is the url of the image
  -- use type="(item, male or female)" to set the appropriate default bg image
  */
  .directive('backImage', ['defaultImages', function (defaultImages) {
    return function(scope, element, attrs){
        attrs.$observe('backImage', function(value) {
          var bgimage = 'url("' + value + '")';
          if (attrs.type) {
            var type = attrs.type;
            bgimage += ', url(' + defaultImages[type] + ')';
          } 
          element.css({
              'background-image': bgimage
          });
          element.addClass(attrs.class);
        })   
    };
  }])
  //fixes the size of the full background so that it is not affected by the resize when the keyboard is open
  .directive('fullbackground', function ($window) {
    return function (scope, element, attrs) {
      element.css({
        'height': $window.innerHeight,
        'width': $window.innerWidth
      })
    }
  });

angular.module('app.directives', [])

      
.directive('background', function () {
    return function(scope, element, attrs){
      attrs.$observe('background', function(value) {
        element.css({ 'background-image': 'url(' + value +')' });
      });
    };
})
//set the appropriate pronoun to use if we pass the gender
//usage <pronoun data-gender={male or female} data-neutral="what to use if gender is not set"></pronoun
.directive('pronoun', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
          var gender = attrs.gender;
          var pronoun = attrs.neutral;
          if (gender == "female"){
            pronoun = "her";
          } else if (gender == "male"){
            pronoun = "his";
          }
          element.text(pronoun);
      }
    };
  })
//use this directive to replace the label of a button with a loading icon while loading
//usage <div animate-on-loading data-text="Button Label" data-loading="{{variable that is set to true while loading}}">
.directive('animateOnLoading', function(){
  return {
    restrict:'A',
    link:function(scope, elem, attrs){
      var label = attrs.text;
      elem.text(label);
      //fix the width of the button with the label on it so the size does not change in the transition
      var mywidth = elem[0].offsetWidth + 1;
      elem.css('width', mywidth);
      attrs.$observe('loading', function(value){
        if (value == "true") {
          elem.html('<span class="loading-icon ion-loading-b"></span>');
        } else {
          elem.text(label);
        }
      });
    }
  };
})
//use this directive to adjust styles based on window height
.directive('adjustByHeight', ['$window',function($window){
  return {
    restrict:'A',
    link:function(scope, elem, attrs){
      var height = $window.innerHeight;
      //iphone4
      if (height <= 480) {
        elem.addClass('short-screen');
      }
    }
  };
}])
//use this directive to resize the window when opening up the keyboard from an input in the footer. 
//The attribute gets placed in the view tag.
//Only applies to IOS
.directive('inputInFooter', ['$window', '$device', 'UserService', function($window, $device, UserService){
  return {
    restrict:'A',
    link:function(scope, elem, attrs){
      function keyboardShowHandler(e){
          elem.css('height', height-e.keyboardHeight);
          elem.removeClass('animate-height');
        }
        function keyboardHideHandler(e){
          elem.css('height', height);
          elem.addClass('animate-height');
        }
      if (ionic.Platform.isIOS()){
        var height = $window.innerHeight;
        
        //disable cordova scrolling to prevent the whole page from scrolling up
        if (cordova) {
          cordova.plugins.Keyboard.disableScroll(true);
        }

        //disabling scroll leaves the input at the bottom under the keyboard so we need to manually adjust the height
        $window.addEventListener('native.keyboardshow', keyboardShowHandler);
        $window.addEventListener('native.keyboardhide', keyboardHideHandler);
         
      }
    }
  };
}])
//add to inputs or textarea tags to take action on the "return" or "go" buttons
//we lose focus on the active element which closes the keyboard
.directive('loseFocusOnReturn', ['$document', function($document) {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {

      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          $document[0].activeElement.blur();
        }
      });
    }
  };
}]);


'use strict';

angular.module('sugarlandDoctorsApp')
  .directive('afloat', function(){
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      // scope: {}, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
       restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      // templateUrl: '',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {
          var $window = angular.element(window);
          function showNavbar(e,v){
            debugger;
            //iElm.offset().top = $("header").height() - iElm.height();
            if(1==1){
              iElm.removeClass('fixed-header').css({
                                                  'display': 'block'
                                              }).fadeIn(300);
            }
            else {
              iElm.addClass('fixed-header').css({
                                    'display': 'none'
                                }).fadeIn(300);
            }
          };

          $window.on('scroll',  showNavbar);
      }
    };
  })
  .controller('MainCtrl', function ($scope, $http, socket,page) {
    $scope.awesomeThings = [];
    page.setTitle("home page");
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });

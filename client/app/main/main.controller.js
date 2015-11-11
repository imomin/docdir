'use strict';

angular.module('sugarlandDoctorsApp')
  .directive('scrollBox', function(){
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
       scope: {list: '='}, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
       restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
       template: '<div class="section-title">' +
                '<h3 style="font-weight:100;text-align:center">Some of our doctors in Sugar land.</h3>' +
              '</div>' +
              '<div  style="overflow-x:hidden;overflow-y:hidden;height:250px;width:100%;padding: 0 15px;">' +
                '<ul class="list-inline inline-list">' +
                    '<li ng-repeat="(index, doctor) in list" style="border:1px solid black;padding:0;height:230px;width:200px;margin-right: 5px;">' +
                        '<img ng-src="{{doctor.profilePicture}}" />' +
                        '<div>{{doctor.name}}<br>{{doctor.specialist}}</div>' +
                        '<pre>{{doctor.profilePicture}}</pre>'+
                    '</li>' +
                '</ul>' +
              '</div>',
      // templateUrl: '',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {

      }
    }
  })

  .directive('hasResult', function(){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          $scope.$watch(function() {
            return $element.attr('aria-expanded'); 
          }, function(isOpen){
              isOpen === 'true' ? $('body').css('overflow', 'hidden') : $('body').css('overflow', 'auto');
          });
        }
    }
  })

  .controller('MainCtrl', function ($scope, $http, $location, socket, page, CommonData) {
    $scope.awesomeThings = [];
    $scope.enableScroll = function(){
      $('body').css('overflow', 'auto');
    }
    CommonData.getRandomDoctors(function(err, data){
        $scope.myInterval = 3000;
        $scope.slides = data;
        var many = 4;
        var i, group = [], items;

        for (i = 0; i < $scope.slides.length; i += many) {
          items = {};
          for (var j = 0; j < many; j++) {
            if($scope.slides[i + j]){
              items["doctor"+j] = $scope.slides[i + j];
            }
          };
          group.push(items);
        }
        $scope.groupedSlides = group;
      });
    $scope.searchDoctor = function(val) {
      return $http.get('/api/doctors/lookup/', {
        params: {
          val: val
        }
      }).then(function(response){
        return response.data.map(function(item){
          return item;
        });
      });
    };

    $scope.onDoctorSelected = function($item, $model, $label){
      $location.path('/'+ $model.specialist.toLowerCase() + '/' + 1);
    }


    page.setTitle("Sugar Land Doctors");

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });




    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });
  });
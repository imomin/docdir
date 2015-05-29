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

  .controller('MainCtrl', function ($scope, $http, socket,page) {
    $scope.awesomeThings = [];
    $scope.randomDoctors = [
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"},
      {"name":"Dr ABC XYZ","specialist":"Dentist","profilePicture:":"/assets/images/553f24fed4186cb8656520e5/f5bdb164-ec43-4e56-bffe-1f86c1b64a62-Aliyana.png"}
    ];

    $scope.myInterval = 3000;
    $scope.slides = [{
      image: 'http://placekitten.com/221/200',
      text: 'Kitten.'
    }, {
      image: 'http://placekitten.com/241/200',
      text: 'Kitty!'
    }, {
      image: 'http://placekitten.com/223/200',
      text: 'Cat.'
    }, {
      image: 'http://placekitten.com/224/200',
      text: 'Feline!'
    }, {
      image: 'http://placekitten.com/225/200',
      text: 'Cat.'
    }, {
      image: 'http://placekitten.com/226/200',
      text: 'Feline!'
    }, {
      image: 'http://placekitten.com/227/200',
      text: 'Cat.'
    }, {
      image: 'http://placekitten.com/228/200',
      text: 'Feline!'
    }, {
      image: 'http://placekitten.com/229/200',
      text: 'Cat.'
    }, {
      image: 'http://placekitten.com/230/200',
      text: 'Feline!'
    }, {
      image: 'http://placekitten.com/230/200',
      text: 'puss'
    }, {
      image: 'http://placekitten.com/230/200',
      text: 'lion'
    }];
    var many = 4;
    var i, group = [], items;

    for (i = 0; i < $scope.slides.length; i += many) {
      items = {};
      for (var j = 0; j < many; j++) {
        if($scope.slides[i + j]){
          items["image"+j] = $scope.slides[i + j];  
        }
      };
      group.push(items);
    }
    $scope.groupedSlides = group;




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

'use strict';

angular.module('sugarlandDoctorsApp')

  .directive('shakeThat', ['$animate', function($animate) {
    return {
      require: '^form',
      scope: {
        submit: '&',
        submitted: '='
      },
      link: function(scope, element, attrs, form) {
        // listen on submit event
        element.on('submit', function() {
          // tell angular to update scope
          scope.$apply(function() {
            // everything ok -> call submit fn from controller
            if (form.$valid) return scope.submit();
            // show error messages on submit
            scope.submitted = true;
            // shake that form
            var promise = $animate.addClass(element, 'shake');
            promise.then(function() {
              $animate.removeClass(element, 'shake');
            });
          });
        });
      }
    }}])

  .controller('doctorSignupCtrl', function ($scope, $state, Auth, $location, $animate) {
    $scope.doctor = {};
    $scope.errors = {};
    $scope.currentIndex = 0;
    $scope.maxIndex = 2;
    $scope.direction = "rtl";
    $scope.nextIndex = 1 
    $scope.prevIndex = 0

    if($state.current.url === '/signup/doctor'){
      $state.go('doctor.login');
    }

    $scope.slide = function(index){
      if($scope.currentIndex < index) {
        $scope.direction = "ltr";
      } 
      else {
        $scope.direction = "rtl";
      }
      $scope.currentIndex = index;
      $scope.nextIndex = $scope.currentIndex + 1 < $scope.maxIndex ? $scope.currentIndex + 1 : $scope.maxIndex;
      $scope.prevIndex = $scope.currentIndex - 1 <= 0 ? 0 : $scope.currentIndex - 1;

      angular.element('#myTab li').each(function(idx,item){
        if(idx <= $scope.currentIndex){
          angular.element(item).addClass("active");
        }
        else {
          angular.element(item).removeClass("active");
        }
      });
    }

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.doctor.name,
          email: $scope.doctor.email,
          password: $scope.doctor.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  })
  .controller('doctorSignupCtrl', function($scope, Auth, $state, $window) {
      $scope.doctor = {};
      $scope.errors = {};

      $scope.submit = function(form) {
        $scope.submitted = true;

        if(form.$valid) {
          Auth.createDoctor({
            firstName: $scope.doctor.firstName,
            lastName: $scope.doctor.lastName,
            email: $scope.doctor.email,
            phone: $scope.doctor.phone,
            password: $scope.doctor.password
          })
          .then( function() {
            // Account created, redirect to home
            $state.go('doctor.emailVerification');
          })
          .catch( function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
        }
      };
  })

  .controller('doctorLoginCtrl', ['$scope', function($scope) {
    // hide error messages until 'submit' event
    $scope.submitted = false;
    // hide success message
    $scope.showMessage = false;
    // method called from shakeThat directive
    $scope.submit = function() {
      // show success message
      $scope.showMessage = true;
    };
  }]);

'use strict';

angular.module('sugarlandDoctorsApp')

  .controller('doctorSignupCtrl', function ($scope, Auth, $location, $animate) {
    $scope.doctor = {};
    $scope.errors = {};
    $scope.currentIndex = 0;
    $scope.direction = "rtl";

    $scope.slide = function(index){
      if($scope.currentIndex < index){
        $scope.direction = "ltr";
      } 
      else {
        $scope.direction = "rtl";
      }
      $scope.currentIndex = index;
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
  });

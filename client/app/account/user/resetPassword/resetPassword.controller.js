'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('ResetUserPasswordCtrl', function($scope,Auth){
    $scope.errors = {};
    $scope.hasError = false;
    $scope.submit = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.resetUserPassword($scope.user.email)
        .then( function() {
          $scope.hasError = false;
          $scope.message = 'An email with new a password is sent.';
          $scope.user.email = '';
        })
        .catch( function(err) {
          $scope.hasError = true;
          $scope.message = 'Email not found.';
        });
      }
    }
  });
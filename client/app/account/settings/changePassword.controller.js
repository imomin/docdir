'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('ChangePasswordCtrl', function ($scope, Doctor, Auth) {
    $scope.errors = {};
    $scope.hasError = false;
    $scope.submit = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changeDoctorPassword($scope.user.oldPassword,$scope.user.newPassword)
        .then( function() {
          $scope.hasError = false;
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          $scope.hasError = true;
          $scope.message = 'Incorrect password';
        });
      }
		};
  });

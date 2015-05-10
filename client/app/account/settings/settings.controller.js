'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.navigate = function(el){
      debugger;
      $event.preventDefault();
      // e.preventDefault();
      // $(this).siblings('a.active').removeClass("active");
      // $(this).addClass("active");
      // var index = $(this).index();
      // $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
      // $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    }

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });

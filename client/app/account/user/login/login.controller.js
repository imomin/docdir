'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('LoginCtrl', function ($rootScope, $scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.hasError = false;

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          var redirectURL = '/';
          // Logged in, redirect to home
          if($rootScope.redirectURL){
            redirectURL = $rootScope.redirectURL;
            $rootScope.redirectURL = null;
          }
          $location.path(redirectURL);
        })
        .catch( function(err) {
          $scope.hasError = true;
          angular.element(form).addClass("shake");
          $location.path('/login');
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });

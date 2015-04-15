'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isDoctorLoggedIn = Auth.isDoctorLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.logoutDoctor = function(){
      Auth.logoutDoctor();
      $location.path("/");
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
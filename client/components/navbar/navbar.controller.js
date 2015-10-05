'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth, specialistItems,CommonData) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isDoctorLoggedIn = Auth.isDoctorLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.getCurrentDoctor = Auth.getCurrentDoctor;
    $scope.specialists = specialistItems.get(); //$rootScope._specialists;
    $scope.specialist = "";

    if(!$scope.specialists){//incase, if the specialistItems is populated.
      CommonData.getSpecialists().then( function(data) {
        $scope.specialists = data;
        specialistItems.set(data);
      }).catch( function(err) {

      });
    }

    $scope.redirect = function(){
      if($scope.specialist !== ""){
        $location.path('/'+ $scope.specialist.url);
      }
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.logoutDoctor = function(){
      Auth.logoutDoctor();
      $location.path("/");
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    if(!$scope.specialists){

    }
  });
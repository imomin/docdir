'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('UserActivityCtrl', function ($scope, User, Auth, $location, $window) {
    $scope.doctors = [];

	User.mylikes(function(data) {
		$scope.doctors = data;
	});
});
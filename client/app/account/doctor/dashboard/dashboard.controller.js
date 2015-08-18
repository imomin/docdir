'use strict';

angular.module('sugarlandDoctorsApp')
	.controller('DashboardCtrl', function ($scope, Auth, Statistic) {
		$scope.stats = {views:0,likes:0,phone:0,website:0};
		Statistic.getStatistics(Auth.getCurrentDoctor()._id, function(err,data){
			$scope.stats = data[0];
		});
	});

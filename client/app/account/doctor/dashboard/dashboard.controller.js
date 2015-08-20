'use strict';

angular.module('sugarlandDoctorsApp')
	.controller('DashboardCtrl', function ($scope, Auth, Statistic) {
		$scope.stats = {views:0,likes:0,phone:0,website:0};
		Statistic.getStatistics(Auth.getCurrentDoctor()._id, function(err,data){
			$scope.stats = data[0];
		});
		var hoursData = [{"hour":0,"label":"12AM","views":1},{"hour":1,"label":"1AM","views":0},{"hour":2,"label":"2AM","views":0},{"hour":3,"label":"3AM","views":1},{"hour":4,"label":"4AM","views":5},{"hour":5,"label":"5AM","views":2},{"hour":6,"label":"6AM","views":10},{"hour":7,"label":"7AM","views":0},{"hour":8,"label":"8AM","views":0},{"hour":9,"label":"9AM","views":0},{"hour":10,"label":"10AM","views":0},{"hour":11,"label":"11AM","views":0},{"hour":12,"label":"12AM","views":0},{"hour":13,"label":"1PM","views":0},{"hour":14,"label":"2PM","views":0},{"hour":15,"label":"3PM","views":0},{"hour":16,"label":"4PM","views":0},{"hour":17,"label":"5PM","views":0},{"hour":18,"label":"6PM","views":0},{"hour":19,"label":"7PM","views":0},{"hour":20,"label":"8PM","views":0},{"hour":21,"label":"9PM","views":0},{"hour":22,"label":"10PM","views":1},{"hour":23,"label":"11PM","views":1}];
		var monthsData = [{"month":0,"label":"Jan","views":0},{"month":1,"label":"Feb","views":0},{"month":2,"label":"Mar","views":0},{"month":3,"label":"Apr","views":0},{"month":4,"label":"May","views":0},{"month":5,"label":"Jun","views":0},{"month":6,"label":"Jul","views":0},{"month":7,"label":"Aug","views":6},{"month":8,"label":"Sep","views":15},{"month":9,"label":"Oct","views":0},{"month":10,"label":"Nov","views":0},{"month":11,"label":"Dec","views":0}];
		var dayOfWeek = [{"day":0,"label":"Mon","views":0},{"day":1,"label":"Tue","views":0},{"day":2,"label":"Web","views":0},{"day":3,"label":"Thu","views":13},{"day":4,"label":"Fri","views":6},{"day":5,"label":"Sat","views":1},{"day":6,"label":"Sun","views":1}];
		
	});

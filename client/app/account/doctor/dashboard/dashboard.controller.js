'use strict';

angular.module('sugarlandDoctorsApp')
	.directive('easyPie', function(){
		return {
			restrict: 'AE',
			scope: {
				dataPercent:'='
			},
			link: function(scope,element,attrs) {
				scope.$watch('dataPercent', function() {
					new EasyPieChart($(element)[0], scope.$eval(attrs.easyPie));
				});
			}
		};
	})
	
	.controller('DashboardCtrl', function ($scope, Auth, Statistic) {
		$scope.stats = {views:0,likes:0,phone:0,website:0};
		$scope.chartData = {};
		$scope.chartData.period = 'week';


		Statistic.getStatistics(Auth.getCurrentDoctor()._id, function(err,data){
			$scope.stats = data[0];
		});
		Statistic.getCountsByMonths(Auth.getCurrentDoctor()._id, function(err,data){
			$scope.monthCountsTotal = 0;
			$scope.monthCountsChartData = [];
			_.forEach(data, function(object, key) {
			  $scope.monthCountsTotal += object.views;
			  $scope.monthCountsChartData.push({'y':object.label, views:object.views});
			});
			_.forEach($scope.monthCountsChartData, function(object, key) {
				object.views = Math.round((object.views/$scope.monthCountsTotal)*100);
			});
		});

		Statistic.getCountsByDays(Auth.getCurrentDoctor()._id, function(err,data){
			$scope.barColor = ['rgb(158, 18, 158)','rgba(49, 18, 158, 0.98)','#2980b9','rgb(15, 162, 53)','rgb(158, 24, 24)','#e74c3c','#f1c40f'];
			$scope.dayCountsTotal = 0;
			$scope.dayCountsChartData = [];
			_.forEach(data, function(object, key) {
			  $scope.dayCountsTotal += object.views;
			});
			//
			_.forEach(data, function(object, key) {
				object.views = Math.round((object.views/$scope.dayCountsTotal)*100);
				$scope.dayCountsChartData.push({'options':{scaleColor: false,trackColor: 'rgba(208, 208, 208, 0.25)',barColor: $scope.barColor[key],lineWidth: 3,lineCap: 'butt',size: 95,animate:3000},'percent':object.views,'label':object.label});
			});
		});
		Statistic.getCountsByHours(Auth.getCurrentDoctor()._id, function(err,data){
			$scope.hourCountsTotal = 0;
			$scope.hourCountsChartData = [];
			_.forEach(data, function(object, key) {
			  $scope.hourCountsTotal += object.views;
			  $scope.hourCountsChartData.push({'y':object.label, views:object.views});
			});
			_.forEach($scope.hourCountsChartData, function(object, key) {
				object.views = Math.round((object.views/$scope.hourCountsTotal)*100);
			});
		});

		Statistic.getCountsByPeriod(Auth.getCurrentDoctor()._id, 'week', function(err,data){
			$scope.viewCountsChartData = [];
			_.forEach(data, function(object, key) {
			  $scope.viewCountsChartData.push({'y':object.label, views:object.views});
			});
		});

		$scope.$watchCollection("chartData.period", function (newValue, oldValue) {
			if(!$scope.chartData[$scope.chartData.period]){
				Statistic.getCountsByPeriod(Auth.getCurrentDoctor()._id, $scope.chartData.period, function(err,data){
					$scope.viewCountsChartData = [];
					_.forEach(data, function(object, key) {//May be this should be done on the server side.
				  		$scope.viewCountsChartData.push({'y':object.label, views:object.views});
					});
					$scope.chartData[$scope.chartData.period] = $scope.viewCountsChartData;
				});
			}
			else {
				$scope.viewCountsChartData = $scope.chartData[$scope.chartData.period];
			}
		});
	});

'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider,isMobileRequest) {
  	if(!isMobileRequest){
  		$stateProvider
		      .state('main', {
		        url: '/',
		        views: {
		        	'@': {
		        		templateUrl: 'app/main/main.html',
		        		controller: 'MainCtrl'
		        	}
		        }
		      });
  	}
  });
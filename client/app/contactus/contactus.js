'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider, isMobileRequest) {
  	if(!isMobileRequest){
  		$stateProvider
	      .state('contactus', {
	        url: '/contactus',
	        templateUrl: 'app/contactus/contactus.html',
	        controller: 'ContactUsCtrl'
	      });
  	}
  });
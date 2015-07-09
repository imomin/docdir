'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider,$urlMatcherFactoryProvider,$provide) {
  	//added to deal with tailing /
  	$urlMatcherFactoryProvider.strictMode(false)

  	$provide.factory('Data',function($http){
debugger;
  	})
  	//Todo: make following array dynamically come from API (database)./api/specialist
  	var states = ["dentist","ent","family-physician","optometrist","obgna"];

//https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views 

  	angular.forEach(states, function(state) {
	    $stateProvider
	      .state(state, {
	        url: '/'+state,
	        templateUrl: 'app/doctors/doctors.html',
	        controller: 'DoctorsCtrl',
	        data: {
	        	speciality:state
	        }
	      })
	      .state(state + '.detail', {
			url: '/:doctorId',
			parent: state,
			controller: 'DoctorsDetailsCtrl'
	     });
	});
  });
'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider,$urlMatcherFactoryProvider) {
  	//added to deal with tailing /
  	$urlMatcherFactoryProvider.strictMode(false)
  	//Todo: make following array dynamically come from API (database).
  	var states = ['dentist','abc','xyz'];

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
			url: '/:doctorId'
	     });
	});
  });
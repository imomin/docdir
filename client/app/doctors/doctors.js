'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider,$urlMatcherFactoryProvider) {
  	//added to deal with tailing /
  	$urlMatcherFactoryProvider.strictMode(false)
  	_$stateProviderRef = $stateProvider;
  });
'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider,isMobileRequest) {
  	var template = isMobileRequest ? 'main.mobile.html' : 'main.html';
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/'+template,
        controller: 'MainCtrl'
      });
  });
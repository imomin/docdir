'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contactus', {
        url: '/contactus',
        templateUrl: 'app/contactus/contactus.html',
        controller: 'ContactUsCtrl'
      });
  });
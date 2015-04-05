'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('doctor', {
        url: '/signup/doctor',
        templateUrl: 'app/account/signup/doctor/index.html',
        controller:'doctorSignupCtrl'
      })
      .state('doctor.bio', {
        url: '/bio',
        templateUrl: 'app/account/signup/doctor/bio.html'
      })
      .state('doctor.education', {
        url: '/education',
        templateUrl: 'app/account/signup/doctor/education.html'
      })
      .state('doctor.featuers', {
        url: '/featuers',
        templateUrl: 'app/account/signup/doctor/features.html'
      })
      .state('doctor.address', {
        url: '/address',
        templateUrl: 'app/account/signup/doctor/address.html'
      })
      .state('doctor.subscribe', {
        url: '/subscribe',
        templateUrl: 'app/account/signup/doctor/subscribe.html'
      });
  });
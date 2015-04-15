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
        url: '/doctor',
        templateUrl: 'app/account/signup/doctor/index.html',
        controller:'doctorSignupCtrl'
      })
      .state('doctor.emailVerification', {
        url: '/thankyou',
        templateUrl: 'app/account/signup/doctor/emailVerification.html'
      })
      .state('doctor.signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/doctor/signup.html'
      })
      .state('doctor.login', {
        url: '/login',
        templateUrl: 'app/account/signup/doctor/login.html',
        controller:'doctorLoginCtrl'
      })
      .state('doctor.resetPassword', {
        url: '/reset',
        templateUrl: 'app/account/signup/doctor/passwordReset.html',
        controller:'doctorLoginCtrl'
      })
      .state('doctor.profile', {
        url: '/profile',
        templateUrl: 'app/account/signup/doctor/profile.html',
        authenticate: true
      })
      .state('doctor.profile.bio', {
        url: '/bio',
        templateUrl: 'app/account/signup/doctor/bio.html',
        authenticate: true
      })
      .state('doctor.profile.education', {
        url: '/education',
        templateUrl: 'app/account/signup/doctor/education.html',
        authenticate: true
      })
      .state('doctor.profile.featuers', {
        url: '/featuers',
        templateUrl: 'app/account/signup/doctor/features.html',
        authenticate: true
      })
      .state('doctor.profile.pictures', {
        url: '/pictures',
        templateUrl: 'app/account/signup/doctor/pictures.html',
        authenticate: true
      })
      .state('doctor.profile.address', {
        url: '/address',
        templateUrl: 'app/account/signup/doctor/address.html',
        authenticate: true
      })
      .state('doctor.profile.subscribe', {
        url: '/subscribe',
        templateUrl: 'app/account/signup/doctor/subscribe.html',
        authenticate: true
      })      
      .state('doctor.profile.finish', {
        url: '/finish',
        templateUrl: 'app/account/signup/doctor/finish.html',
        authenticate: true
      });
  });
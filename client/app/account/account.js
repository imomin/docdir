'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/user/login',
        templateUrl: 'app/account/user/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/user/signup',
        templateUrl: 'app/account/user/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('activity', {
        url: '/activity',
        templateUrl: 'app/account/user/user.html',
        controller: 'UserCtrl',
        authenticate: true
      })
      .state('changeuserpassword', {
        url: '/user/changepassword',
        templateUrl: 'app/account/user/changePassword/changePassword.html',
        controller: 'ChangeUserPasswordCtrl',
        authenticate: true
      })
      .state('resetPassword', {
        url: '/user/reset',
        templateUrl: 'app/account/user/resetPassword/resetPassword.html',
        controller: 'ResetUserPasswordCtrl',
        authenticate: true
      })
      .state('changepassword', {
        url: '/doctor/changepassword',
        templateUrl: 'app/account/doctor/changePassword/changePassword.html',
        controller: 'ChangePasswordCtrl',
        authenticate: true
      })
      .state('conference',{
        url: '/conference?conf',
        templateUrl: 'app/account/conference/conference.html',
        controller: 'ConferenceCtrl',
        authenticate: true
      })
      .state('dashboard', {
        url: '/doctor/dashboard',
        templateUrl: 'app/account/doctor/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        authenticate: true
      })
      .state('doctor', {
        url: '/doctor',
        templateUrl: 'app/account/doctor/index.html',
        controller:'doctorSignupCtrl'
      })
      .state('doctor.emailVerification', {
        url: '/thankyou',
        templateUrl: 'app/account/doctor/emailVerification.html'
      })
      .state('doctor.signup', {
        url: '/signup',
        templateUrl: 'app/account/doctor/signup.html'
      })
      .state('doctor.login', {
        url: '/login',
        templateUrl: 'app/account/doctor/login.html',
        controller:'doctorLoginCtrl'
      })
      .state('doctor.resetPassword', {
        url: '/reset',
        templateUrl: 'app/account/doctor/passwordReset.html',
        controller:'doctorLoginCtrl'
      })
      .state('doctor.profile', {
        url: '/profile',
        templateUrl: 'app/account/doctor/profile.html',
        authenticate: true
      })
      .state('doctor.profile.bio', {
        url: '/bio',
        templateUrl: 'app/account/doctor/bio.html',
        authenticate: true,
        data: {
            index:0
          }
      })
      .state('doctor.profile.profilePicture', {
        url: '/photo',
        templateUrl: 'app/account/doctor/profilePicture.html',
        authenticate: true,
        data: {
            index:1
          }
      })
      .state('doctor.profile.education', {
        url: '/education',
        templateUrl: 'app/account/doctor/education.html',
        authenticate: true,
        data: {
            index:2
          }
      })
      .state('doctor.profile.additionalInformation', {
        url: '/additionalInformation',
        templateUrl: 'app/account/doctor/additionalInformation.html',
        authenticate: true,
        data: {
            index:3
          }
      })
      .state('doctor.profile.address', {
        url: '/address',
        templateUrl: 'app/account/doctor/address.html',
        authenticate: true,
        data: {
            index:4
          }
      })
      .state('doctor.profile.pictures', {
        url: '/pictures',
        templateUrl: 'app/account/doctor/pictures.html',
        authenticate: true,
        data: {
            index:5
          }
      })
      .state('doctor.profile.subscribe', {
        url: '/subscribe',
        templateUrl: 'app/account/doctor/subscribe.html',
        authenticate: true,
        data: {
            index:6
          }
      })      
      .state('doctor.profile.finish', {
        url: '/finish',
        templateUrl: 'app/account/doctor/finish.html',
        authenticate: true,
        data: {
            index:7
          }
      });
  });
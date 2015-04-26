'use strict';

angular.module('sugarlandDoctorsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.carousel',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.buttons',
  'angularPayments',
  'ngMap',
  'ngImgCrop',
  'nya.bootstrap.select',
  'ngAnimate',
  'jcs-autoValidate',
  'angularFileUpload'
])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    Stripe.setPublishableKey('your-publishable-key');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        if ($cookieStore.get('tokend')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('tokend');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/');///login
          // remove any stale tokens
          $cookieStore.remove('token');
          $cookieStore.remove('tokend');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .factory('page', function() {
    var title = 'default title';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = newTitle }
    };
  })

  .controller('pageTitleCtrl', function($scope, page) {
      $scope.page = page;
  })

  .directive('scroll', function ($window) {
    return {
      restrict: 'A',
      scope: {
        subscription: '=',
        index: '@'
      },
      link: function(scope, elem, attrs) {
          scope.onResize = function() {
              var scrollHeight = $window.innerHeight - elem[0].getBoundingClientRect().top;;
              elem.css({'height':scrollHeight});
          }

          scope.onResize();

          angular.element($window).bind('resize', function() {
              scope.onResize();
          })
      }
    }
  })

  .run(function ($q, $rootScope, $location, Auth, validator, defaultErrorMessageResolver,bootstrap3ElementModifier) {
      // angular auto validate settings.
      $rootScope.customErrors = {"duplicateEmail":"The specified email address is already in use.",
        "blankEmail":"Email cannot be blank.",
        "blankPassword":"Password cannot be blank.",
        "InvalidEmailOrPassword":"Invalid email or password."};
      bootstrap3ElementModifier.enableValidationStateIcons(true);
      defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        angular.forEach($rootScope.customErrors, function(value, key){
          errorMessages[key] = value;
        });
        errorMessages["card"] = "Invalid card number.";
        errorMessages["expiry"] = "Invalid expiration date.";
        errorMessages["cvc"] = "Invalid CVC number.";
      });
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
      Auth.isDoctorLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          if(next.name.split(".")[0] === "doctor"){
            $location.path('/signup/doctor/login');
          }
        }
      });

      // Auth.isLoggedInAsync(function(loggedIn) {
      //   if (next.authenticate && !loggedIn) {
      //       $location.path('/login');
      //   }
      // });

    });
  });
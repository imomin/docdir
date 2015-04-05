'use strict';

angular.module('sugarlandDoctorsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ngMap',
  'nya.bootstrap.select',
  'ngAnimate'
])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
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

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
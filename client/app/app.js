'use strict';
//var _$stateProviderRef = null;

angular.module('sugarlandDoctorsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.alert',
  'ui.bootstrap.typeahead',
  'ui.bootstrap.carousel',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.buttons',
  'angularPayments',
  'ngImgCrop',
  'nya.bootstrap.select',
  'ngAnimate',
  'jcs-autoValidate',
  'angularFileUpload',
  'ez.timepicker',
  'angular.morris-chart'
])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    Stripe.setPublishableKey('pk_test_VZQrOeMrh2S3F26kwVe9xF5M');
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

  .factory('beforeUnload', function ($rootScope, $window, $cookies, $cookieStore) {
      // Events are broadcast outside the Scope Lifecycle
      angular.forEach($cookies, function(cookie, key){
        if(key.indexOf('view') !== -1){
          $cookieStore.remove(key);
        }
      });
      return {};
  })

  .factory('page', function() {
    var title = 'Sugar Land Doctors';
    var metaDescription = 'Find doctors in Sugar Land area.';
    var metaKeywords = 'Sugar Land';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = newTitle },
      metaDescription: function() { return metaDescription; },
      metaKeywords: function() { return metaKeywords; },
      reset: function() {
        metaDescription = 'Sugar Land Doctors';
        metaKeywords = 'Sugar Land';
      },
      setMetaDescription: function(newMetaDescription) {
        metaDescription = newMetaDescription;
      },
      appendMetaKeywords: function(newKeywords) {
        for (var key in newKeywords) {
          if (metaKeywords === '') {
            metaKeywords += newKeywords[key].name;
          } else {
            metaKeywords += ', ' + newKeywords[key].name;
          }
        }
      }
    };
  })

  .controller('pageTitleCtrl', function($scope, page) {
      $scope.page = page;
  })

  .directive('scroll', function ($window) {
    return {
      restrict: 'A',
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

  .run(function ($q, $rootScope, $location, $window, $templateCache, CommonData, Auth, validator, defaultErrorMessageResolver,bootstrap3ElementModifier,beforeUnload) {
      CommonData.getSpecialists().then( function(data) {
          $rootScope._specialists = data;
        }).catch( function(err) {

        });
      //using this for caching data.
      $rootScope.doctorContact = {};

      // angular auto validate settings.
      $rootScope.customErrors = {"duplicateEmail":"The specified email address is already in use.",
        "blankEmail":"Email cannot be blank.",
        "blankPassword":"Password cannot be blank.",
        "InvalidEmailOrPassword":"Invalid email or password.",
        "EmailNotFound":"Email not found."};
      bootstrap3ElementModifier.enableValidationStateIcons(true);
      defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        angular.forEach($rootScope.customErrors, function(value, key){
          errorMessages[key] = value;
        });
        errorMessages["card"] = "Invalid card number.";
        errorMessages["expiry"] = "Invalid expiration date.";
        errorMessages["cvc"] = "Invalid CVC number.";
      });

      $templateCache.put('ez-timepicker.html',
        "<div class=\"dropdown ez-timepicker-container\">\n" +
        "  <div class=\"dropdown-toggle\" ng-class=\"inputContainerClass\">\n" +
        "    <div class=\"time-input\" ng-transclude></div>\n" +
        // "    <span class=\"input-group-btn\">\n" +
        // "      <a class=\"btn btn-default btn-sm\">\n" +
        // "        <i ng-class=\"clockIconClass\"></i>\n" +
        // "      </a>\n" +
        // "    </span>\n" +
        "  </div>\n" +
        "  <div class=\"dropdown-menu\" ng-click=\"preventDefault($event)\">\n" +
        "    <div class=\"hours-col\" ng-class=\"widgetColClass\">\n" +
        "      <div><a class=\"btn\" ng-click=\"incrementHours()\"><i ng-class=\"incIconClass\"></i></a></div>\n" +
        "      <div class=\"hours-val\">{{ widget.hours }}</div>\n" +
        "      <div><a class=\"btn\" ng-click=\"decrementHours()\"><i ng-class=\"decIconClass\"></i></a></div>\n" +
        "    </div>\n" +
        "    <div class=\"minutes-col\" ng-class=\"widgetColClass\">\n" +
        "      <div><a class=\"btn\" ng-click=\"incrementMinutes()\"><i ng-class=\"incIconClass\"></i></a></div>\n" +
        "      <div class=\"minutes-val\">{{ widget.minutes }}</div>\n" +
        "      <div><a class=\"btn\" ng-click=\"decrementMinutes()\"><i ng-class=\"decIconClass\"></i></a></div>\n" +
        "    </div>\n" +
        "    <div class=\"meridian-col\" ng-class=\"widgetColClass\" ng-show=\"showMeridian\">\n" +
        "      <div><a class=\"btn\" ng-click=\"toggleMeridian()\"><i ng-class=\"incIconClass\"></i></a></div>\n" +
        "      <div class=\"meridian-val\" ng-click=\"toggleMeridian()\">{{ widget.meridian }}</div>\n" +
        "      <div><a class=\"btn\" ng-click=\"toggleMeridian()\"><i ng-class=\"decIconClass\"></i></a></div>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n"
      );

        // '<a>' +
        //     '<img ng-src="{{match.model.profilePicture}}" width="48">' +
        //     '<span bind-html-unsafe="match.model.firstName | typeaheadHighlight:query"></span>' +
        // '</a>'


            // '<div class="col-xs-12 col-sm-3">' +
            //     '<img ng-src="{{match.model.profilePicture}}" alt="{{match.model.firstName}} {{match.model.lastName}}" class="img-responsive img-circle" />' +
            // '</div>' +
            // '<div class="col-xs-12 col-sm-9">' +
            //     '<span class="name">{{match.model.firstName | typeaheadHighlight:query}} {{match.model.lastName  | typeaheadHighlight:query}} {{match.model.credential}}</span><br/>' +
            //     '<span>{{match.model.specialist}}</span><br>' +
            //     '<span> <i class="fa fa-heart" style="color:red;"></i> 23 likes</span>' +
            // '</div>' +
            // '<div class="clearfix"></div>' +

            

      $templateCache.put('auto-complete',
        '<a href="/{{match.model.specialist | lowercase}}/{{match.model.doctorId}}">' +
            '<div class="typeahead" style="font-weight: lighter;clear:none;width:370px;left:515px;">' +
            '<div class="pull-left"><img ng-src="{{match.model.profilePicture}}" alt="{{match.model.firstName}} {{match.model.lastName}}" width="48" height="48" class=""></div>' +
            '<div class="pull-left margin-small" style="padding-left: 10px;">' +
            '<div class="text-left">{{match.model.firstName}} {{match.model.lastName}} {{match.model.credential}}</div>' +
            '<div class="text-left">{{match.model.specialist}}</div>' +
            '<div class="text-left"> <i class="fa fa-heart" style="color:red;"></i> 23 likes <i class="fa fa-eye"></i> 89 viwes</div>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '</div>' +
        '</a>'
        );

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

    $rootScope.$on("$locationChangeStart",function(event, next, current){
        if (easyrtc.webSocket) {
            easyrtc.disconnect();
        }
    });
  });
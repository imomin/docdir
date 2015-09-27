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

  .constant('isMobileRequest', !!(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))return true})(navigator.userAgent||navigator.vendor||window.opera))

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, isMobileRequest) {
    
    // var mainTemplate = isMobileRequest ? "app/mobile/main/main.html" : "app/main/main.html";
    // var mainController = isMobileRequest ? "MobileMainCtrl" : "MainCtrl";

    //  $stateProvider
    //   .state('main', {
    //     url: '/',
    //     templateUrl: mainTemplate,
    //     controller: mainController
    //   });

    $urlRouterProvider
      .otherwise("/");
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

  .run(function ($q, $rootScope, $location, $window, $templateCache, $http, CommonData, Auth, socket, validator, defaultErrorMessageResolver,bootstrap3ElementModifier,beforeUnload) {
      CommonData.getSpecialists().then( function(data) {
          $rootScope._specialists = data;
        }).catch( function(err) {

        });
      //using this for caching data.
      $rootScope.doctorContact = {};
      $rootScope.conferenceSession = [];
      $http.get('/api/conferences').success(function(activeSessions) {
        $rootScope.conferenceSession = activeSessions;
        socket.syncUpdates('conference', $rootScope.conferenceSession);
      });

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
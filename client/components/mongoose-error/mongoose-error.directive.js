'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('sugarlandDoctorsApp')
  .directive('mongooseError', function ($rootScope) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          //Custom Code, Added to handle all the validity KEY errors.
          angular.forEach($rootScope.customErrors, function(value, key){
            ngModel.$setValidity(key, true);
          });
          //End Custom Code
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });
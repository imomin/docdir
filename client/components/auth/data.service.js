'use strict';

angular.module('sugarlandDoctorsApp')
  .factory('CommonData', function Auth($location, $rootScope, $http, $cookieStore, $q) {
    return {
      getSpecialists: function(callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/specialists', {}).
          success(function(data) {
            //$cookieStore.put('specialists', data);
            deferred.resolve(data);
            return cb(null,data);
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

          return deferred.promise;
        }
      }
  });
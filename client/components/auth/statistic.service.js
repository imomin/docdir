'use strict';

angular.module('sugarlandDoctorsApp')
  .factory('Statistic', function Auth($location, $rootScope, $http, $cookieStore, $q) {
    return {
      addViewCount: function(doctorId, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/view', {'_doctor':doctorId}).
          success(function(data) {
            deferred.resolve(data);
            return cb(null,data);
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

          return deferred.promise;
        },
      addLikeCount: function(doctorId, userId, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/like', {'_doctor':doctorId, '_user':userId}).
          success(function(data) {
            deferred.resolve(data);
            return cb(null,data);
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

          return deferred.promise;
        },
      addPhoneCount: function(doctorId, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/phone',  {'_doctor':doctorId}).
          success(function(data) {
            deferred.resolve(data);
            return cb(null,data);
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

          return deferred.promise;
        },
      addWebsiteCount: function(doctorId, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/website',  {'_doctor':doctorId}).
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
        },
      getStatistics: function(doctorId, callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/statistics/'+doctorId+'/summary', {}).
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
  });
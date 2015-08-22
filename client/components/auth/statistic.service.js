'use strict';

angular.module('sugarlandDoctorsApp')
  .factory('Statistic', function Statistic($location, $rootScope, $http, $cookieStore, $q) {
    return {
      addViewCount: function(_Id, callback) {
          if($cookieStore.get('view'+_Id)) {
            return;
          }
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/view', {'_doctor':_Id}).
          success(function(data) {
            $cookieStore.put('view'+_Id,true);
            deferred.resolve(data);
            return cb(null,data);
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

          return deferred.promise;
        },
      addLikeCount: function(_Id, userId, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/like', {'_doctor':_Id, '_user':userId}).
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
      UnlikeDoctor: function(_Id, userId, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/unlike', {'_doctor':_Id, '_user':userId}).
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
      addPhoneCount: function(_Id, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/phone',  {'_doctor':_Id}).
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
      addWebsiteCount: function(_Id, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/api/statistics/website',  {'_doctor':_Id}).
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
      getStatistics: function(_Id, callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/statistics/'+_Id+'/summary', {}).
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
      getCountsByPeriod: function(_Id, period,  callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/statistics/'+_Id+ '/'+ period +'/summarybyperiod', {}).
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
      getCountsByHours: function(_Id, callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/statistics/'+_Id+'/viewbyhours', {}).
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
      getCountsByDays: function(_Id, callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/statistics/'+_Id+'/viewbydays', {}).
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
      getCountsByMonths: function(_Id, callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/api/statistics/'+_Id+'/viewbymonths', {}).
          success(function(data) {
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
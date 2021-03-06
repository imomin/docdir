'use strict';

angular.module('sugarlandDoctorsApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, Doctor, $cookieStore, $q) {
    var currentUser = {};
    var currentDoctor = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }
    if($cookieStore.get('tokend')) {
      currentDoctor = Doctor.get();
    }
    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      },

      /**
       * Create a new doctor
       *
       * @param  {Object}   doctor     - doctor info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createDoctor: function(doctor, callback) {
        var cb = callback || angular.noop;

        return Doctor.save(doctor,
          function(data) {
            //$cookieStore.put('tokend', data.token);
            //currentDoctor = Doctor.get();
            return cb(doctor);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },
      /**
       * Update doctor's data
       *
       * @param  {Object}   doctor     - doctor info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      updateDoctor: function(doctor, callback) {
        var cb = callback || angular.noop;

        return Doctor.update(doctor,
          function(data) {
            //$cookieStore.put('tokend', data.token);
            //currentDoctor = Doctor.get();
            return cb(doctor);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },
       /**
       * Subscribe doctor's data
       *
       * @param  {Object}   doctor     - doctor info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      subscribeDoctor: function(doctor, callback) {
        var cb = callback || angular.noop;

        return Doctor.subscribe(doctor,
          function(data) {
            //$cookieStore.put('tokend', data.token);
            //currentDoctor = Doctor.get();
            return cb(doctor);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      loginDoctor: function(doctor, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/doctor', {
          email: doctor.email,
          password: doctor.password
        }).
        success(function(data) {
          $cookieStore.put('tokend', data.token);
          currentDoctor = Doctor.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logoutDoctor();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      confirmEmail: function(token,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.get('/api/doctors/confirm/'+token).
        success(function(data) {
          $cookieStore.put('tokend', data.token);
          currentDoctor = Doctor.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logoutDoctor();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },
      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logoutDoctor: function() {
        $cookieStore.remove('tokend');
        currentDoctor = {};
      },
      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isDoctorLoggedInAsync: function(cb) {
        if(currentDoctor.hasOwnProperty('$promise')) {
          currentDoctor.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentDoctor.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },
            /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isDoctorLoggedIn: function() {
        return currentDoctor.hasOwnProperty('_id');
      },      
      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentDoctor: function() {
        return currentDoctor;
      },
            /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changeDoctorPassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return Doctor.changePassword({ id: currentDoctor._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      /**
       * Reset user password
       *
       * @param  {String}   email
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      resetUserPassword: function(email, callback) {
        var cb = callback || angular.noop;

        return User.resetPassword({'id': email}, {}, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      /**
       * Reset user password
       *
       * @param  {String}   email
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      resetDoctorPassword: function(email, callback) {
        var cb = callback || angular.noop;

        return Doctor.resetPassword({'id': email}, {}, function(doctor) {
          return cb(doctor);
        }, function(err) {
          return cb(err);
        }).$promise;
      }
    };
  });

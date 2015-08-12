'use strict';

angular.module('sugarlandDoctorsApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      resetPassword: {
        method: 'PUT',
        params: {
          id:'@email',
          controller:'resetpassword'
        }
      }
	  });
  });
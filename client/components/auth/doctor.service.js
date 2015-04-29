'use strict';

angular.module('sugarlandDoctorsApp')
  .factory('Doctor', function ($resource) {
    return $resource('/api/doctors/:id/:controller', {
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
      update: {
        method: 'PUT'
      }
	  });
  });
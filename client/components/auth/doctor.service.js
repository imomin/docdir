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
      },
      details: {
        method: 'GET',
        params: {
          id:'@specialist',
          controller:'@Id'
        }
      },
      subscribe: {
        method: 'PUT',
        params: {
          controller:'subscribe' //api/doctor/:id/subscribe
        }
      }
	  });
  });
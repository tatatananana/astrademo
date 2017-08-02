'use strict';
angular
  .module('com.module.core')
  .config(function($httpProvider) {

    // Intercept error responses
    $httpProvider.interceptors.push(function ($q, $location, CoreService) {
      return {
        responseError: function (rejection) {

          console.log(rejection);
          CoreService.toastError('Error '+rejection.status+' received', rejection.data
            .error.message);

          return $q.reject(rejection);
        }
      };
    });

  })
  .run(function($location) {
    //app default path
    $location.path('/app/drawing/list');
  });

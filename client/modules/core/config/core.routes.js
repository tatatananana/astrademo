'use strict';
angular
  .module('com.module.core')
  .config(function($stateProvider) {
    $stateProvider
    .state('app', {
      abstract: true,
      url: '/app',
      templateUrl: 'modules/core/views/app.html',
      controller: 'AppCtrl'
    });

  });

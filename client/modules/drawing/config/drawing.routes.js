'use strict';
angular
  .module('com.module.drawing')
  .config(function($stateProvider,$urlRouterProvider) {
    $stateProvider
      .state('app.drawing', {
        abstract: true,
        url: '/drawing',
        templateUrl: 'modules/drawing/views/main.html'
      })
      .state('app.drawing.list', {
        url: '/list',
        templateUrl: 'modules/drawing/views/list.html',
        controller: 'ListCtrl'
      })
      .state('app.drawing.create', {
        url: '/create/:hash',
        templateUrl: 'modules/drawing/views/create.html',
        controller: 'CreateCtrl'
      });

      $urlRouterProvider.otherwise(function($injector) {
          var $state = $injector.get('$state');
          $state.go('app.drawing.list');
          console.log("default activeted");
      });
  });

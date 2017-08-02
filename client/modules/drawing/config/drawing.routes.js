'use strict';
angular
  .module('com.module.drawing')
  .config(function($stateProvider) {
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
        url: '/create',
        templateUrl: 'modules/drawing/views/create.html',
        controller: 'CreateCtrl'
      });
  });

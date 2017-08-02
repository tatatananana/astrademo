'use strict';
angular
  .module('com.module.core')
  .controller('AppCtrl', function($scope,
      $state, CoreService) {
        $scope.errors = CoreService.errors;
        $scope.successes = CoreService.successes;
      });

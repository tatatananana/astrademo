'use strict';
angular
  .module('com.module.core')
  .controller('AppCtrl', function($scope,
      $state, CoreService) {
        console.log("AppCtrl");
        $scope.errors = CoreService.errors;
        $scope.successes = CoreService.successes;
      });

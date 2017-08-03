'use strict';
angular
  .module('com.module.drawing')
  .controller('SavedModalCtrl', function($scope,$state,$uibModalInstance,shareLink) {


    $scope.shareLink = shareLink;

    // scope functions
    $scope.ok = function () {
      $uibModalInstance.close();
      $state.go('app.drawing.list');
    };
  });

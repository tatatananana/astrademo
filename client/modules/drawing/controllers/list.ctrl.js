'use strict';
angular
  .module('com.module.drawing')
  .controller('ListCtrl', function($scope, $state, DrawingService) {

    //ctrl init function
    this.$onInit = function() {
      $scope.draws = [];
      getDrawings();
    };

    function getDrawings() {
      DrawingService.get().then(function(results) {
        $scope.draws = results;
      });
    }

    //scope functions
    $scope.add = function() {
      $state.go('app.drawing.create');
    };

    $scope.remove = function($event,item) {
      console.log("remove",item.id);

      DrawingService.deleteById(item.id).then(function() {
        getDrawings();
      });

      $event.stopPropagation();
    };

    $scope.edit = function(item) {
      console.log("edit",item);
    };

  });

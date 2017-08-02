'use strict';
angular
  .module('com.module.drawing')
  .controller('ListCtrl', function($scope,
      $state, DrawingService) {

    //ctrl init function
    function init() {
      $scope.todos = [];
      getTodos();
    }
    init();

    function getTodos() {
      DrawingService.get().then(function(results) {
        $scope.todos = results;
      });
    }

    //scope functions
    $scope.addTodo = function() {
      console.log("add");
      //TODO imliment redirect
    };

    $scope.removeTodo = function($event,item) {
      console.log("remove",item.id);

      DrawingService.deleteById(item.id).then(function() {
        getTodos();
      });

      $event.stopPropagation();
    };

    $scope.edit = function(item) {
      console.log("edit",item);
    };

  });

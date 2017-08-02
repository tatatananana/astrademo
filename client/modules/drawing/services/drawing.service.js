'use strict';
angular
  .module('com.module.drawing')
  .service('DrawingService',function(Todo) {

    function loadall() {
      return Todo.find().$promise;
    }

    function deleteById(id) {
      return Todo.deleteById().$promise;
    }

    //export
    return {
      get:loadall,
      deleteById: deleteById
    };
  });

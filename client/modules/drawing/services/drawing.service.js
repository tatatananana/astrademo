'use strict';
angular
  .module('com.module.drawing')
  .service('DrawingService',function(Draw) {

    function loadall() {
      return Draw.find().$promise;
    }

    function deleteById(id) {
      return Draw.deleteById().$promise;
    }

    //export
    return {
      get:loadall,
      deleteById: deleteById
    };
  });

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

    function save(draw) {
      return Draw.create(draw).$promise;
    }

    //export
    return {
      get:loadall,
      save:save,
      deleteById: deleteById
    };
  });

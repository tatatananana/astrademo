'use strict';
angular
  .module('com.module.drawing')
  .service('DrawingService',function(Draw) {

    function loadall() {
      return Draw.find().$promise;
    }

    function load(hash) {
      return Draw.find({ filter: {
                                where: {
                                  hashKey: hash
                                }
                              }
                            }).$promise;
    }

    function deleteById(id) {
      return Draw.deleteById({id:id}).$promise;
    }

    function save(draw) {
      return Draw.create(draw).$promise;
    }

    //export
    return {
      get:loadall,
      save:save,
      deleteById: deleteById,
      load:load
    };
  });

'use strict';
angular
  .module('com.module.core')
  .service('CoreService', function ($timeout) {
    //gloal
    this.errors = [];
    this.successes = [];

    this.toastError = function (title, text) {
      toast('errors',this,title, text)
    };

    this.toastSuccess = function (title, text) {
      toast('successes',this,title, text)
    };

    //helper func, push alerts
    function toast(name,self,title, text) {
      self[name].push({title:title, msg:text});
      clearAfterTimeout(name,self);
    }

    //clear alerts timeout
    function clearAfterTimeout(name,self) {
      $timeout(function (self){
        self[name].shift();
      }.bind(null,self),3000)
    }

  });

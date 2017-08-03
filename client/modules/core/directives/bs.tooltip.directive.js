// https://stackoverflow.com/questions/20666900/using-bootstrap-tooltip-with-angularjs
'use strict';
angular
  .module('com.module.core')
  .directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

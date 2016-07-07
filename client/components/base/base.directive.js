angular.module('base').directive('base', function(){

    return {
        controller: "baseCtrl as baseCtrl",
        templateUrl: 'base/base.html'
    };
});

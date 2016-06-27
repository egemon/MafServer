angular.module('base').directive('base', ()=>{

    return {
        controller: "baseCtrl as baseCtrl",
        templateUrl: 'base/base.html'
    };
});

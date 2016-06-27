angular.module('base').directive('periodSelector', ()=>{

    return {
        scope: {
            periodType: '=',
            period: '=',
            year: '=',
        },
        controller: "periodSelectorCtrl as periodSelectorCtrl",
        restrict: 'E',
        templateUrl: 'periodSelector/period-selector.html'
    };
});

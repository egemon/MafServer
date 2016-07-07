angular.module('base').directive('periodSelector', function(){

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

angular.module('base').directive('periodSelector', function(){

    return {
        scope: {
            periodType: '=',
            period: '=',
            year: '=',
            onClick: '='
        },
        controller: "periodSelectorCtrl as periodSelectorCtrl",
        restrict: 'E',
        templateUrl: 'periodSelector/period-selector.html'
    };
});

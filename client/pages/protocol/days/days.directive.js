angular.module('ProtocolApp')
.directive('days', function () {
    return {
        restrict: 'E',
        templateUrl: 'protocol/days/days.html',
        controller: 'DaysCtrl as DaysCtrl',
        scope: {
            state: '=',
            days: '=',
            players: '=',
        }
    };
});

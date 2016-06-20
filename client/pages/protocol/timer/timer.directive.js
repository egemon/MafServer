angular.module('timer')
.directive('timer', function () {
    return {
        restrict: 'E',
        templateUrl: 'protocol/timer/timer.html',
        controller: 'timerCtrl as timer'
    };
});
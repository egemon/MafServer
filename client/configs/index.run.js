(function () {

angular.module('base').run(['$rootScope', '$timeout', generalRun]);

function generalRun ($rootScope, $timeout) {
    animateLogo($rootScope);

    function animateLogo ($scope) {
        $scope.logoClass = 'animating-started';
        $timeout(function () {
            $scope.logoClass = 'animating-ended';
        }, 1500);
    }
}

})();
angular.module('base').controller('RatingCtrl',
    ['$scope',
function($scope){
    $scope.$on('rating-request', restoreDefaults);

    this.getRating = getRating;

    // ====== METHODS =========
    function getRating () {
        $scope.fetchDataFor($scope.page, 0, {
            periodType: this.periodType,
            period: this.period.value,
            year: this.year.value
        });
    }

    // ======== PRIVATE =======
    function restoreDefaults() {
        $scope.$broadcast('restore-defaults');
    }

}]);
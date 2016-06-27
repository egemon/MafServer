angular.module('base').controller('periodSelectorCtrl', ['$scope', 'CONFIG',
($scope, CONFIG)=> {
    let today = new Date();
    $scope.filterFields = CONFIG.filterFields;

    $scope.periodType = 'month';
    $scope.period = $scope.filterFields.month.value
        .find(function (el) {
            return el.value ==  +today.toISOString().split('T')[0].split('-')[1];
    });
    $scope.year = $scope.filterFields.year.value
        .find(function (el) {
            return el.value ==  today.getUTCFullYear();
    });

    $scope.$on('restore-defaults', restoreDefaults);
    $scope.$watch('periodType', defaultPeriod);


    // ======= PRIVATE ==========
    let defaults = {};
    ({
        periodType: defaults.periodType,
        period: defaults.period,
        year: defaults.year
    } = $scope);

    function restoreDefaults() {
        ({
            periodType: $scope.periodType,
            period: $scope.period,
            year: $scope.year  
        } = defaults;)
    }

    function defaultPeriod (periodType, oldPeriodType) {
        if (periodType === oldPeriodType) {
            return;
        }

        if (periodType === 'year') {
            $scope.period.value = '';
            return;
        }

        $scope.period = $scope.filterFields[periodType].value[0];
    }

}]);
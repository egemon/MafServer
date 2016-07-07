angular.module('base').controller('periodSelectorCtrl', ['$scope', 'CONFIG',
function($scope, CONFIG) {
    var today = new Date();
    $scope.filterFields = CONFIG.filterFields;

    $scope.periodType = 'month';
    $scope.period = getObjByValue(+today.toISOString().split('T')[0].split('-')[1], $scope.filterFields.month.value);
    $scope.year = getObjByValue(today.getUTCFullYear(), $scope.filterFields.year.value);

    $scope.$on('restore-defaults', restoreDefaults);
    $scope.$watch('periodType', defaultPeriod);


    // ======= PRIVATE ==========

    function getObjByValue(value, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == value) {
                return array[i];
            }
        }
    }

    var defaults = {
        periodType: $scope.periodType,
        period: $scope.period,
        year: $scope.year
    };

    function restoreDefaults() {
        $scope.periodType = defaults.periodType;
        $scope.period = defaults.period;
        $scope.year = defaults.year;
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
angular.module('base').controller('GamesCtrl',
    ['$scope',
function($scope) {

    var vm = this;
    vm.filterObject = {
        periodType: '',
        period: '',
        year: '',
    };

    vm.getGames = getGames;

    function getGames() {
        var req = {
            periodType: vm.filterObject.periodType,
            period: vm.filterObject.period.value,
            year: vm.filterObject.year.value,
        };

        $scope.fetchDataFor({url:'games'}, 3, req);
    }

}]);
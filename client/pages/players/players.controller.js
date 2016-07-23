angular.module('base').controller('playersCtrl', ['$scope',
function($scope) {
    var vm = this;
    vm.onRegisterApi = $scope.onRegisterApi;

    $scope.$on('data-fetched', function(event, data){
        vm.columnDefs = _.map(_.keys(data[0]), function (key) {
            return {
                field: key
            };
        });
        vm.columnDefs.push({
            field: 'deleteItem',
            cellTemplate: 'grid/cell-templates/grid-controls.html',
            minWidth: 210
        });
    });

}]);
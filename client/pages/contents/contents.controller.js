angular.module('base').controller('contentsCtrl', ['$scope',
function($scope) {
    var vm = this;
    vm.onRegisterApi = $scope.onRegisterApi;

    $scope.$on('data-fetched', function(event, responseContent){
        vm.columnDefs = _.map(_.keys(responseContent.data[0]), function (key) {
            return {
                field: key
            };
        });
        vm.columnDefs.push({
            field: 'deleteItem',
            cellTemplate: 'grid/cell-templates/grid-controls.html'
        });
    });

}]);
angular.module('base').controller('contentsCtrl', ['$scope', 'serverService',
function($scope, serverService) {
    var vm = this;

    vm.onRegisterApi = onRegisterApi;
    vm.addEvent = addEvent;
    vm.deleteRow = deleteRow;
    vm.data = $scope.contents;

    vm.columnDefs = [
    {
        field: 'vk',
    },{
        field: 'price',
    },{
        field: 'place',
    },{
        field: 'description',
    },{
        field: 'entry',
    },{
        field: 'date',
    },{
        field: 'number',
    },{
        field: 'type',
    },{
        field: 'title',
    },{
        field: 'id',
    },{
        field: 'deleteItem',
        cellTemplate: 'grid/cell-templates/grid-controls.html'
    }
    ];


    function onRegisterApi(gridApi) {
        gridApi.edit.on.afterCellEdit($scope, cellValueChanged);
    }

    function cellValueChanged(rowEntity) {
        serverService.setItems(rowEntity, 'contents');
    }

    function addEvent(news) {
        var item = angular.copy(news[0]);
        delete item.id;
        serverService.create('news', item)
        .then(function () {
            news.unshift(item);
        });

    }

    function deleteRow(news, item) {
        serverService.delete('news', item.id)
        .then(function () {
            news = news.splice(_.findIndex(news, item), 1);
        });
    }

}]);
(function () {

angular.module('base').run(['$rootScope', '$timeout', 'serverService', 'CONFIG', generalRun]);

function generalRun ($rootScope, $timeout, serverService, CONFIG) {
    animateLogo($rootScope);
    injectHelpers($rootScope);
    $rootScope.STATIC_URL = CONFIG.STATIC_URL;
    function animateLogo ($scope) {
        $scope.logoClass = 'animating-started';
        $timeout(function () {
            $scope.logoClass = 'animating-ended';
        }, 1500);
    }

    function injectHelpers($scope) {

        // helper to workl with DB tables
        $scope.deleteItem = function deleteItem(table, items, item) {

            // TODO: remove PG
            if (table === 'contents') {
                table = 'news';
            }

            serverService.delete(table, item.id)
            .then(function () {
                items = items.splice(_.findIndex(items, item), 1);
            });
        };

        $scope.addItem = function addItem(table, items, item) {

            // TODO: remove PG
            if (table === 'contents') {
                table = 'news';
            }

            if (!item) {
                item = angular.copy(items[0]);

                _.each(item, function (val, key, obj) {
                    if (_.includes(key, 'date')) {
                        obj[key] = '01/01/01';
                    } else {
                        obj[key] = '';
                    }
                });

                delete item.id;
            }

            serverService.create(table, item)
            .then(function (response) {
                item.id = response.data;
                items.unshift(item);
            });
        };



        $scope.onRegisterApi = function onRegisterApi(gridApi) {
            gridApi.edit.on.afterCellEdit($scope, $scope.cellValueChanged.bind(null, $scope.page.url));
        };

        $scope.cellValueChanged = function cellValueChanged(table, rowEntity) {
            console.log('cellValueChanged', arguments);
            if (table === 'contents') {
                table = 'news';
            }

            serverService.update(table, rowEntity, rowEntity.id);
        };
    }

}
})();
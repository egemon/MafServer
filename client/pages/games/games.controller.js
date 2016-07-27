angular.module('base').controller('GamesCtrl',
    ['$scope', '$filter',
function($scope, $filter) {
    var vm = this;
    vm.onRegisterApi = $scope.onRegisterApi;
    var displayNames = {
        'bp': 'Лучшие игроков',
        'br': 'Лучшие судей',
        'board': 'Стол',
        'date': 'Дата',
        'gamenumber': '№ игры',
        'referee': 'Судья',
        'playernumber': '№ игрока',
        'nick': 'Ник',
        'role': 'Роль',
        'win': 'Победа'
    };

    $scope.$on('data-fetched', function(event, data){
        vm.columnDefs = _.map(_.keys(data[0]), function (key) {
            return {
                field: key,
                displayName: displayNames[key] || key,
                enableCellEdit: false,
                filter: {
                    placeholder: 'Введите данные для фильтра'
                }
            };
        });


        data = _.map(data, function (game) {
            game.date = $filter('date')(game.date);
        });

        // vm.columnDefs.push({
        //     field: 'deleteItem',
        //     displayName: 'Удалить',
        //     cellTemplate: 'grid/cell-templates/grid-controls.html'
        // });
    });


    vm.filterObject = {
        periodType: '',
        period: '',
        year: ''
    };

    vm.getGames = getGames;

    function getGames() {
        var req = {
            periodType: vm.filterObject.periodType,
            period: vm.filterObject.period.value,
            year: vm.filterObject.year.value
        };

        $scope.fetchDataFor({url:'games'}, 3, req);
    }

}]);
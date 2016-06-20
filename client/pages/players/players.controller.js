angular.module('base')
.controller('playersCtrl',
['$scope', 'CONFIG', 'editService','serverService', 'dateFilter',
function($scope, CONFIG, editService,  serverService, dateFilter) {

    this.inputTypes = CONFIG.inputTypes;


    $scope.setPlayers = setPlayers;
    $scope.addNewPlayer = addNewPlayer;
    $scope.removeItem = editService.removeItem;
    $scope.addPresent = editService.addItem;
    $scope.startEdit = editService.startEdit;

    function setPlayers(players) {
        serverService.setItems(players, 'players');
    }

    function addNewPlayer (user) {
        console.log('[players.controller] addPlayer() ', arguments);
        var newPlayerObj = angular.copy(user);
        emptyUser(user);
        formatDate(newPlayerObj);
        editService.addItem($scope.players.data, newPlayerObj);
    }

    function emptyUser(user) {
        for(var key in user){
            user[key] = "";
        }
    }

    function formatDate(newPlayerObj) {
        newPlayerObj.birthday =  dateFilter(newPlayerObj.birthday, 'yyyy-MM-dd');
    }

}]);
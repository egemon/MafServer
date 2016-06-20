angular.module('ProtocolApp')
.controller('PlayerCtrl', ['$scope', 'game', PlayerCtrl]);

function PlayerCtrl ($scope, game) {
    var vm = this;
    //======= FIELDS =========
    vm.data = game.playerLines[$scope.number];

    //======== METHODS ==========
    vm.decrFall = decrFall;
    vm.incrFall = incrFall;

    ///////////////
    function decrFall() {
        vm.data.falls--;
    }
    function incrFall() {
        vm.data.falls++;
    }

}


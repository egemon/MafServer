angular.module('ProtocolApp')
.controller('MetadataCtrl', ['$scope', 'game', MetadataCtrl]);

function MetadataCtrl ($scope, game) {
    var vm = this;
    vm.data = game.metadata;
    //======= FIELDS =========

}

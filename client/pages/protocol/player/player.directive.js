angular.module('ProtocolApp')
.directive('player', function () {
    return {
        restrict: 'EA',
        templateUrl: 'protocol/player/player.html',
        controller: 'PlayerCtrl as player',
        scope: {
            number: '=',
            maxFalls: '=',
            roles: '=',
            playerNicks: "="
        }
    };
});

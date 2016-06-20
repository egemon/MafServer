angular.module('ProtocolApp')
.directive('protocol', function () {
    return {
        restrict: "E",
        templateUrl: 'protocol/protocol/protocol.html',
        controller: 'ProtocolCtrl as protocol'
    };
});
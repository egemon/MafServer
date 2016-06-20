angular.module('ProtocolApp')
.directive('metadata', function () {
    return {
        restrict: 'EA',
        templateUrl: 'protocol/metadata/metadata.html',
        controller: 'MetadataCtrl as metadata',
        scope: {
            tables: '=',
            wins: '=',
            playerNicks: "=",
        }
    };
});
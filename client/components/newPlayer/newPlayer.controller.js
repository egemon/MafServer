angular.module('base').controller('newPlayerCtrl', ['$scope', 'CONFIG',
function($scope, CONFIG) {

    this.data = {
        presents: [],
        honours: []
    };

    $scope.inputTypes = CONFIG.inputTypes;
}]);
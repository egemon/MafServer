angular.module('base').controller('contentsCtrl', ['$scope', 'editService', 'serverService',
function($scope, editService, serverService) {
    $scope.startEdit = editService.startEdit;
    $scope.removeItem = editService.removeItem;
    $scope.addItem = editService.addItem;
    $scope.newEvent = {};

    $scope.setMeetings = setMeetings;

    function setMeetings(data) {
        serverService.setItems(data, 'contents');
    }
}]);
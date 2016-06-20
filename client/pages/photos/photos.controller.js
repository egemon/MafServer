(function () {

angular.module('base')
.controller('photosCtrl', ['$scope', 'editService', 'serverService', photosCtrl]);

function photosCtrl($scope, editService, serverService) {

    var vm = this;
    vm.addItem = changePhoto.bind('addItem');
    vm.removeItem = changePhoto.bind('removeItem');

    function changePhoto(command, photos, photo) {
        editService[command](photos, photo);
        serverService.setItems(photos, 'photos');
    }
}

})();

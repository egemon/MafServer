angular.module('base')
.directive("fileModel", ['serverService', function (serverService) {
    return {
        scope: {
            fileModel: "=",
            onReady: "=",
            grid:"=",
            row:"="
        },
        link: function (scope, element) {
            element.bind("change", function (changeEvent) {
                if (changeEvent.target.files.length === 0) {
                    scope.$apply(function () {
                        scope.fileModel = '';
                    });
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileModel = loadEvent.target.result;
                        serverService.savePlayerImage(scope.row.entity.id, scope.row.entity.nick, loadEvent.target.result);
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);
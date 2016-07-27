angular.module('base')
.directive("fileModel", [function () {
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
                        scope.row.entity.imglink = loadEvent.target.result;
                        scope.onReady(scope.grid.appScope.page.url, scope.row.entity);
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);
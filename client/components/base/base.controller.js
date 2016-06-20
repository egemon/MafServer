angular.module('base')
.controller('baseCtrl',
['PAGES', '$scope', 'serverService', '$timeout', '$window', '$location', 'editService',
function(PAGES, $scope, serverService, $timeout, $window, $location, editService) {

    var pageUrl = $location.path().slice(1);
    var firstPage = findPageByUrl(pageUrl) || PAGES[0];
    setPage(firstPage);
    $scope.PAGES = PAGES;
    $scope.loginActive = false;
    $scope.user = serverService.player;

    $scope.login = login;

    $scope.setPage = setPage;
    $scope.openNewTab =  openNewTab;
    $scope.fetchDataFor = fetchDataFor;
    $scope.addItem = editService.addItem;
    $scope.removeItem = editService.removeItem;

    // ===== public methods
    function login (user) {
        console.log('[base.controller] login()', arguments);

        serverService.$_login(user);
    }

    function setPage (page) {
        console.log('[base.controller] setPage()', arguments);

        $scope.page = page;
        if (page.needData) {
            if (page.url == 'rating') {
                $scope.$broadcast('rating-request');
            }

            if (page.url == 'register') {
                $scope.$broadcast('register-request');
            }

            fetchDataFor(page, page.needMemberLevel, page.data);
        }
    }

    function openNewTab (url) {
        console.log('[base.controller] openNewTab()', arguments);

        if (url) {
            $window.open(url, '_blank');
        }
    }

    function fetchDataFor (page, needMemberLevel, data) {
        page = page || $scope.page;
        console.log('[base.controller] fetchDataFor()', arguments);

        return serverService.$_fetchData(page, needMemberLevel, data)
            .catch(handleError.bind(this, page))
            .then(attchDataToScope.bind(this, $scope, page));
    }


    // ===== private mehtods
    function handleError (page, err) {
        console.log('[base.controller] handleError()', arguments);

        $scope.err = err;
    }

    function findPageByUrl(url) {
        console.log('[base.controller] findPageByUrl()', arguments);

        for (var i = 0; i < PAGES.length; i++) {
            var el = PAGES[i];
            if (el.url == url) {
                return el;
            }
        }
    }

    function attchDataToScope ($scope, page, response) {
        console.log('[base.controller] attchDataToScope()', arguments);

        if (response.errorText) {
            $location.path(setPage(PAGES[0]));
        } else {
            $scope[page.url] = response;
        }
    }
}]);
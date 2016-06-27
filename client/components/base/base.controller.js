angular.module('base')
.controller('baseCtrl',
['PAGES', '$scope', 'serverService', '$timeout', '$window', '$location', 'editService',
function(PAGES, $scope, serverService, $timeout, $window, $location, editService) {

    const pageUrl = $location.path().slice(1);
    setPage(findPageByUrl(pageUrl) || PAGES[0]);
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
        switch (page.needData && page.url) {
            case ('rating'):
                $scope.$broadcast('rating-request');
            break;
            case ('register'):
                $scope.$broadcast('register-request');
            break;
        }
        fetchDataFor(page, page.needMemberLevel, page.data);
    }

    function openNewTab (url) {
        console.log('[base.controller] openNewTab()', arguments);

        if (url) {
            $window.open(url, '_blank');
        }
    }

    function fetchDataFor (page = $scope.page, needMemberLevel, data) {
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

        for (var page of PAGES) {
            return page.url == url && page;
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
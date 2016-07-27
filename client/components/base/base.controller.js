angular.module('base')
.controller('baseCtrl',
['PAGES', '$scope', 'serverService', '$timeout', '$window', '$location', 'editService',
function(PAGES, $scope, serverService, $timeout, $window, $location, editService) {

    var pageUrl = $location.path().slice(1);
    var firstPage = _.find(PAGES, {url: pageUrl}) || PAGES[0];
    setPage(firstPage);


    $scope.PAGES = PAGES;
    $scope.loginActive = false;
    $scope.user = serverService.player;

    $scope.login = serverService.$_login;

    $scope.setPage = setPage;
    $scope.openNewTab =  openNewTab;
    $scope.fetchDataFor = fetchDataFor;

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
            .then(attchDataToScope.bind(this, $scope, page));
    }

    function attchDataToScope ($scope, page, data) {
        console.log('[base.controller] attchDataToScope()', arguments);
        $scope[page.url] = data;
    }
}]);
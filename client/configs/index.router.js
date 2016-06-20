(function () {
    angular.module('base')
    .config(['CONFIG', 'club','PAGES', '$stateProvider', '$urlRouterProvider',  routerConfig]);

  function routerConfig (CONFIG, club, PAGES, $stateProvider, $urlRouterProvider) {

    CONFIG.BASE_SERVER_URL = club.BASE_SERVER_URL = location.origin + '/';
    // var tmplsUrl = CONFIG.TEMPLATES_URL;
    $urlRouterProvider.otherwise('/' + PAGES[0].url);

    for (var i = 0; i < PAGES.length; i++) {
      var page = PAGES[i];
      var url = '/' + page.url;

      // var name = page.name;
      $stateProvider.state(url, {
        url: url,
        templateUrl: page.url + url + '.html',
        controller: page.controller,
      });
    }
  }

})();
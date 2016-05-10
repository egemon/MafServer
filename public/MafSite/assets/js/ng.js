angular.module('base', ['ui.router', 'server', 'ngAnimate', 'templates', 'ProtocolApp','ngCookies', 'autocomplete']);
angular.module('config', []);
angular.module('server', ['config']);
try {
    angular.module('templates');
} catch(e) {
    angular.module('templates', []);
}

(function () {
    angular.module('base')
    .config(['CONFIG', 'club','PAGES', '$stateProvider', '$urlRouterProvider',  routerConfig]);

  function routerConfig (CONFIG, club, PAGES, $stateProvider, $urlRouterProvider) {

    CONFIG.BASE_SERVER_URL = club.BASE_SERVER_URL = location.origin + '/';
    var tmplsUrl = CONFIG.TEMPLATES_URL;
    $urlRouterProvider.otherwise('/' + PAGES[0].url);

    for (var i = 0; i < PAGES.length; i++) {
      var page = PAGES[i];
      var url = '/' + page.url;

      // var name = page.name;
      $stateProvider.state(url, {
        url: '/' + page.url,
        templateUrl: tmplsUrl + url + '.html',
        controller: page.controller,
      });
    }
  }

})();
(function () {

angular.module('base').run(['$rootScope', '$timeout', generalRun]);

function generalRun ($rootScope, $timeout) {
    animateLogo($rootScope);

    function animateLogo ($scope) {
        $scope.logoClass = 'animating-started';
        $timeout(function () {
            $scope.logoClass = 'animating-ended';
        }, 1500);
    }
}

})();
angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("base.html","<!DOCTYPE html>\r\n<html lang=\"en\" ng-app=\"base\" ng-strict-di>\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <title>BakerStreet 221b Mafia Club</title>\r\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"public/MafSite/assets/css/base.min.css\">\r\n</head>\r\n<body id=\"page-container\" ng-controller=\"baseCtrl\">\r\n    <header id=\"header\">\r\n        <div class=\"page-title-container\">\r\n            <a id=\"page-logo-ref\" ui-sref=\"{{\'/\' + PAGES[0].url}}\" ng-click=\"setPage(PAGES[0])\">\r\n                <img src=\"public/MafSite/assets/img/main_logo.png\" alt=\"BakerLogo\" id=\"pageLogo\" ng-class=\"logoClass\" >\r\n            </a>\r\n            <div id=\"page-title\">\r\n                \"Baker Street 221b\" Mafia Club\r\n            </div>\r\n        <login-form ng-include=\"\'pages/partials/loginForm.html\'\"></login-form>\r\n        </div>\r\n        <nav>\r\n            <ul class=\"main-menu\">\r\n                <li class=\"main-menu-item\" ng-repeat=\"(i, thisPage) in PAGES\" ng-class=\"{current:thisPage == page}\" ng-show=\"user.data.memberLevel >= thisPage.needMemberLevel\">\r\n                    <a class=\"main-menu-ref\" ui-sref=\"{{\'/\' + thisPage.url}}\" ng-click=\"setPage(thisPage)\">\r\n                        {{thisPage.name}}\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </nav>\r\n    </header>\r\n    <main ui-view id=\"view\">\r\n    </main>\r\n\r\n\r\n    <script src=\"public/MafSite/assets/js/main.min.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\r\n</body>\r\n</html>");
$templateCache.put("pages/contacts.html","<div\r\n    class=\"player\"\r\n    id=\"top0-player\"\r\n    ng-repeat=\"(i, player) in contacts\"\r\n    ng-include=\"\'pages/partials/player.html\'\">\r\n</div>");
$templateCache.put("pages/contents.html","<button class=\"set-data-button\" ng-click=\"setMeetings(contents.data)\">Внести данные</button>\r\n<table>\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat=\"(i, key) in contents.fields\">{{::key}}</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr ng-repeat=\"(j, meeting) in contents.data\">\r\n            <td ng-repeat=\"(k, key) in contents.fields\">\r\n                <div\r\n                ng-click=\"startEdit($event, meeting)\"\r\n                class=\"content-block\"\r\n                key=\"{{::key}}\"\r\n                >\r\n                {{::meeting[key]}}\r\n                </div>\r\n            </td>\r\n            <td>\r\n                <button class=\"remove-button\" ng-click=\"removeItem(contents.data, meeting)\">-</button>\r\n            </td>\r\n        </tr>\r\n        <tr>\r\n           <td ng-repeat=\"(k, key) in contents.fields\">\r\n                <input type=\"text\" ng-model=\"newEvent[key]\">\r\n            </td>\r\n            <td>\r\n                <button class=\"remove-button\" ng-click=\"addItem(contents.data, newEvent); newEvent={};\">+</button>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n</table>");
$templateCache.put("pages/error.html","Error!\r\n<%err%>");
$templateCache.put("pages/hall_of_fame.html","<div class=\"top-block\">\r\n    <div ng-repeat=\"(i, period) in hall_of_fame\">\r\n        <title class=\"top-title\">{{period.title}}</title>\r\n        <div id=\"top-players\">\r\n            <div ng-repeat=\"(j, player) in period.honours\" class=\"player\" id=\"top{{j+1}}-player\" ng-include=\"\'pages/partials/player.html\'\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n");
$templateCache.put("pages/home.html","<article class=\"about_us_article\">\r\n    <p>\r\n        Клуб мафии Киевского Национального Университета им.Т. Шевченко Baker Street 221b проводит игры в течении 5 лет,\r\n        являясь членом Студенческой Лиги Игры Мафия (СЛИМ) Федерации Интеллектуальной Игры Мафия(ФИИМ).\r\n    </p>\r\n    <p>\r\n        Подарок от клуба для всех именинников - бесплатное посещение следующей встречи после Вашего дня рождения.\r\n    </p>\r\n    <p>\r\n        Коллектив организаторов желает Вам приятных и интересных игр!\r\n    </p>\r\n    <p>\r\n        PS: Чтобы получать приглашения на встречи и быть в курсе всех событий из жизни клуба, вступайте в <a href=\"https://vk.com/baker_street_mafia_club\" target=\"_blank\"> нашу группу</a>\r\n    </p>\r\n    <p>\r\n        Добро пожаловать в Игру!\r\n    </p>\r\n</article>\r\n\r\n");
$templateCache.put("pages/members.html","<div class=\"top-block\">\r\n    <div id=\"top-players\">\r\n        <div ng-repeat=\"(i, player) in members\" class=\"player\" id=\"top0-player\" ng-include=\"\'pages/partials/player.html\'\">\r\n        </div>\r\n    </div>\r\n</div>\r\n");
$templateCache.put("pages/news.html","<article class=\"article\" ng-repeat=\"(i, new) in news\">\n    <title class=\"article-title\">\n      {{::new.type === \'встреча\' ? new.number + new.title : new.title}}\n    </title>\n    <img class=\"player-logo\" ng-if=\"new.img\"\n      ng-src=\"data-base/players/img/{{::new.img}}\"\n      onerror=\"this.src = \'public/MafSite/assets/img/main_logo.png\'; this.onerror=\'\'\"\n    >\n    <p class=\"entry\">\n        {{::new.entry}}\n      <a ng-if=\"new.vk\"  href=\'{{:: new.vk || \"https://vk.com/bs_vstrecha_\" + new.number}}\' target=\'_blank\'>\n          глянуть вк...\n      </a>\n    </p>\n    <p ng-if=\"new.what\">\n      Что? - {{::new.what}}\n    </p>\n    <p ng-if=\"new.where\">\n      Где? -\n      <a href=\"https://goo.gl/oFev5u\">\n       {{::new.where}}\n      </a>\n    </p>\n    <p ng-if=\"new.when\">\n       Когда? - {{::new.when | date}}\n    </p>\n    <p ng-if=\"new.price\">\n       Сколько? - {{::new.price}} за вечер игр\n    </p>\n    <p>\n      С уважением, команда организаторов.\n    </p>\n</article>");
$templateCache.put("pages/photos.html","<div class=\"photo\" ng-repeat=\"(i, photo) in photos\">\r\n    <button\r\n        id=\"add-player-button\"\r\n        ng-click=\"photosCtrl.removeItem(photos, photo)\"\r\n        ng-show=\"user.data.memberLevel >= 3\">Удалить</button>\r\n    <a href=\"{{::photo.href}}\" title=\"{{::photo.title}}\" target=\"_blank\">\r\n        <img class=\"photo-logo\"\r\n        onerror=\"this.src=\'../img/main_logo_black2.png\'; this.onerror=\'\'\"\r\n        ng-src=\"{{::photo.src}}\"\r\n        alt=\"{{::photo.title}}\"\r\n        >\r\n    </a>\r\n    <p class=\"photo-title\">{{::photo.title}}</p>\r\n    <p class=\"photo-date\">{{::photo.date | date}}</p>\r\n</div>\r\n\r\n\r\n<div ng-show=\"user.data.memberLevel >= 3\">\r\n    <label>\r\n        Название\r\n    <input\r\n        type=\"text\"\r\n        ng-model=\"newPhoto.title\"\r\n    >\r\n    </input>\r\n    </label>\r\n    <label>\r\n        Дата\r\n    <input\r\n        type=\"date\"\r\n        ng-model=\"newPhoto.date\"\r\n    >\r\n    </input>\r\n    </label>\r\n    <label>\r\n        Ссылка\r\n    <input\r\n        type=\"text\"\r\n        ng-model=\"newPhoto.href\"\r\n    >\r\n    </input>\r\n    </label>\r\n    <label>\r\n        Картинка\r\n    <input\r\n        type=\"text\"\r\n        ng-model=\"newPhoto.src\"\r\n    >\r\n    </input>\r\n    </label>\r\n    <button id=\"add-player-button\" ng-click=\"photosCtrl.addItem(photos, newPhoto);newPhoto = {};\">Добавить</button>\r\n</div>");
$templateCache.put("pages/players.html","<button class=\"set-data-button\" ng-click=\"setPlayers(players.data)\">Внести данные</button>\r\n<table class=\"table players-table table-hover\">\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat=\"(j, field) in players.fields\">{{::field}}</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr ng-repeat=\"(i, player) in players.data\" ng-include=\"\'pages/partials/player-tr.html\'\">\r\n        </tr>\r\n        <tr>\r\n            <tr new-player\r\n                add-present=\"addPresent(presents, present)\"\r\n                fields=\"players.fields\"\r\n                add-player=\"addNewPlayer(player)\"\r\n                start-edit=\"startEdit($event, player)\"\r\n                remove-item=\"removeItem(items, item)\"\r\n            ></tr>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n\r\n");
$templateCache.put("pages/protocols.html","<protocol></protocol>");
$templateCache.put("pages/rating.html","<period-selector\r\n  period-type=\"RatingCtrl.periodType\"\r\n  period=\"RatingCtrl.period\"\r\n  year=\"RatingCtrl.year\"\r\n  ></period-selector>\r\n<button class=\"show-rating-button\" ng-click=\"RatingCtrl.getRating()\">Показать рейтинг</button>\r\n\r\n<table class=\"table table-bordered\" id=\"ratingTable\" border=\'1\'>\r\n  <thead>\r\n    <tr>\r\n      <th>Фото</th>\r\n      <th>Ник</th>\r\n      <th>Сумма</th>\r\n      <th>Игр</th>\r\n      <th>Среднее</th>\r\n      <th>Лучшие от игроков</th>\r\n      <th>Лучшие от Судей</th>\r\n    </tr>\r\n  </thead>\r\n  <tbody>\r\n    <tr class=\"rating-row\" id=\"{{::player.nick}}\" ng-repeat=\"(i, player) in rating\">\r\n      <td id=\"{{::player.avatar}}\">\r\n        <img class=\"playerAvatarInRating\"\r\n        onerror=\"this.src=\'public/MafSite/assets/img/main_logo.png\'; this.onerror=\'\'\"\r\n        ng-src=\"data-base/players/img/{{::player.nick}}.jpg\"\r\n        alt=\"\">\r\n      </td>\r\n      <td>{{::player.nick}}</td>\r\n      <td>{{::player.sum}}</td>\r\n      <td>{{::player.gameNumber}}</td>\r\n      <td>{{::player.sum / player.gameNumber | number:2}}</td>\r\n      <td>{{::player.BP}}</td>\r\n      <td>{{::player.BR}}</td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n<script src=\"../js/plain/rating.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\r\n");
$templateCache.put("pages/register.html","<button class=\"set-data-button\"\r\nng-click=\"registerCtrl.setRegister(register.data, date)\"\r\nng-disabled=\"!registerCtrl.isValid()\"\r\n>Внести данные</button>\r\n<div class=\"hint\">\r\n    Введите ники всех игроков!\r\n</div>\r\n<div>\r\n    <label>\r\n        Дата встречи\r\n        <input type=\"date\" ng-model=\"date\">\r\n    </label>\r\n    <label>\r\n        Бюджет встречи: {{registerCtrl.getSum()}}\r\n    </label>\r\n</div>\r\n\r\n<table class=\"table players-table table-hover\">\r\n    <thead>\r\n        <tr>\r\n            <th>\r\n                #\r\n            </th>\r\n            <th ng-repeat=\"(j, field) in register.fields\">{{::field.name}}</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr\r\n            ng-repeat=\"(i, player) in register.data\">\r\n            <td>\r\n                {{:: i+1}}\r\n            </td>\r\n            <td\r\n            ng-repeat=\"(k, field) in register.fields\"\r\n            >\r\n                <autocomplete\r\n                ng-if=\"field.name === \'nick\'\"\r\n                ng-model=\"player[field.name]\"\r\n                data=\"vm.playerNicks\"\r\n                ></autocomplete>\r\n\r\n                <input\r\n                ng-if=\"field.name !== \'nick\'\"\r\n                type=\"{{::field.type}}\"\r\n                ng-model=\"player[field.name]\"\r\n                >\r\n            </td>\r\n            <td>\r\n                <button ng-click=\"removeItem(register.data, player)\"> - </button>\r\n            </td>\r\n        </tr>\r\n        <tr ng-init=\"newPlayer = {}\">\r\n            <td>\r\n                {{register.data.length + 1}}\r\n            </td>\r\n            <td\r\n\r\n                ng-repeat=\"(k, field) in register.fields\"\r\n                >\r\n\r\n                <autocomplete\r\n                ng-if=\"field.name === \'nick\'\"\r\n                ng-model=\"newPlayer[field.name]\"\r\n                data=\"vm.playerNicks\"\r\n                ></autocomplete>\r\n\r\n                <input\r\n                ng-if=\"field.name !== \'nick\'\"\r\n                type=\"{{::field.type}}\"\r\n                ng-model=\"newPlayer[field.name]\">\r\n            </td>\r\n            <td>\r\n                <button ng-click=\"addItem(register.data, newPlayer); newPlayer = {};\">+</button>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n\r\n</table>\r\n");
$templateCache.put("pages/partials/loginForm.html","<div>\r\n    <button class=\"form-button\" id=\'showLogin\' ng-click=\"loginActive = !loginActive\">{{loginActive ? \'Скрыть\' : \'Логин\'}}</button>\r\n    <div id=\"authform\" ng-show=\"loginActive\">\r\n        <input class=\"form-input\" id=\"user\" type=\"text\" placeholder=\"Ник\" ng-model=\"user.data.nick\">\r\n        <input class=\"form-input\" id=\"password\" type=\"password\" placeholder=\"Пароль\" ng-model=\"user.data.password\">\r\n        <button\r\n            id=\"authButton\"\r\n            class=\"form-button\"\r\n            ng-click=\"login(user); loginActive = false;\">\r\n            Войти\r\n        </button>\r\n    </div>\r\n</div>");
$templateCache.put("pages/partials/player-tr.html","<td ng-repeat=\"(j, key) in players.fields\" >\r\n<div ng-if=\"key === \'#\'\">\r\n    {{::i+1}}\r\n</div>\r\n\r\n<div\r\n    class=\"player-input\"\r\n    key=\"{{::key}}\"\r\n    ng-if=\"key !== \'presents\' && key !== \'honours\' && key !== \'image\' && key !== \'#\'\"\r\n    ng-click=\"startEdit($event, player, playersCtr.inputTypes[key])\"\r\n    date = \"{{::key == \'birthday\' ? (player[key] | date:\'yyyy-MM-dd\') : \'\'}}\"\r\n>\r\n    {{::key == \'birthday\' ? (player[key] | date) : player[key]}}\r\n</div>\r\n<div class=\"hint\">\r\n    Данные некорректны! Проверьте.\r\n</div>\r\n\r\n<!-- presents container -->\r\n<div\r\n    class=\"player-presents-container\"\r\n    ng-if=\"key ===\'presents\'\"\r\n    data=\"{{::player.presents}}\"\r\n>\r\n    <!-- player-continer in repeate -->\r\n    <div\r\n        class = \"present-container\"\r\n        ng-repeat=\"(j, present) in player[key] track by $index \"\r\n    >\r\n        <span\r\n            data={{::present}}\r\n            key=\"presents\"\r\n            iterator=\"{{::j}}\"\r\n            ng-click=\"startEdit($event, player)\"\r\n        >\r\n            {{::present}}\r\n        </span>\r\n        <button class=\"remove-present-button\" ng-click=\"removeItem(player.presents, present)\">-</button>\r\n    </div>\r\n    <div>\r\n        <input\r\n            class=\"new-present-input\"\r\n            type=\"text\"\r\n            ng-model=\"newPresent\">\r\n        <button\r\n            class=\"add-present-button\"\r\n            ng-click=\"addPresent(player.presents, newPresent); newPresent = \'\'\"\r\n        >+</button>\r\n    </div>\r\n</div>\r\n\r\n<div\r\n    ng-if=\"key ===\'honours\'\"\r\n    ng-repeat=\"(j, honour) in player.honours track by $index\"\r\n>\r\n    <div\r\n        class=\"honour-container\"\r\n        ng-repeat=\"(clue, val) in honour\"\r\n    >\r\n        <span class=\"player-honour-key\">\r\n            {{::clue}} :\r\n        </span>\r\n        <span\r\n            class=\"player-honour-value\"\r\n            key=\"{{::key}}\"\r\n            clue=\"{{::clue}}\"\r\n            iterator=\"{{::j}}\"\r\n            ng-click=\"startEdit($event, player)\"\r\n        >\r\n            {{::val}}\r\n        </span>\r\n    </div>\r\n\r\n</div>\r\n\r\n<div\r\n    ng-if=\"key ===\'image\'\"\r\n    >\r\n    <input\r\n        type = \"file\"\r\n        file-model = \"player.imgFile\"\r\n    >\r\n</div>\r\n</td>\r\n<td>\r\n    <button class=\"remove-player-button\" ng-click=\"removeItem(players.data, player)\">-</button>\r\n</td>\r\n");
$templateCache.put("pages/partials/player.html","<img\r\n    class=\"player-logo\"\r\n    ng-src=\"data-base/players/img/{{player.img}}\"\r\n    alt=\"{{player.nick}}\"\r\n    ng-click=\"openNewTab(player.vk)\"\r\n    vk={{player.vk}}\r\n>\r\n<div class=\"player-text-container\">\r\n    <p class=\"player-nick\">{{player.nick}}</p>\r\n    <p class=\"player-faculty\">{{player.name}}</p>\r\n    <p class=\"player-results\" ng-show=\"player.avr\">{{player.avr + \' средний бал \'}}{{\'(\' + player.gameNumber + \' игр)\'}}</p>\r\n    <p class=\"player-faculty\" ng-show=\"player.memberLevel > 2\">{{player.position}}</p>\r\n    <p class=\"player-faculty\">{{player.faculty}}</p>\r\n    <p class=\"player-exp\">{{player.experiance}}</p>\r\n    <p class=\"player-faculty\" ng-show=\"player.memberLevel > 2\">{{player.phone}}</p>\r\n    <div class=\"honours\">\r\n        <div\r\n        ng-repeat=\"(j, honour) in player.honours\"\r\n        title=\"{{honour.title}}\"\r\n        class=\"{{honour.type}}-{{honour.place}} honour\"\r\n        ></div>\r\n    </div>\r\n</div>\r\n");
$templateCache.put("pages/directives/new-player.html","<td ng-repeat=\"(i, key) in fields\">\r\n<input\r\n    type=\"{{::inputTypes[key]}}\"\r\n    key=\"{{::key}}\"\r\n    ng-if=\"key !== \'presents\' && key !== \'honours\'\"\r\n    ng-model=\"newPlayer.data[key]\"\r\n>\r\n</input>\r\n<div class=\"hint\">\r\n    Данные некорректны! Проверьте.\r\n</div>\r\n\r\n\r\n<!-- presents container -->\r\n<div\r\n    ng-if=\"key ===\'presents\'\"\r\n    class=\"player-presents-container\"\r\n    data=\"{{::newPlayer.data.presents}}\"\r\n>\r\n    <!-- player-continer in repeate -->\r\n    <div\r\n        class=\'present-container\'\r\n        ng-repeat=\"(j, present) in newPlayer.data.presents track by $index \"\r\n    >\r\n        <span\r\n            data={{::present}}\r\n            key=\"presents\"\r\n            iterator=\"{{::j}}\"\r\n            ng-click=\"startEdit({$event: $event, player: newPlayer.data})\"\r\n        >\r\n            {{::present}}\r\n        </span>\r\n        <button class=\"remove-present-button\" ng-click=\"removeItem({items: newPlayer.data.presents, item: present})\">-</button>\r\n    </div>\r\n\r\n    <!--  new present container-->\r\n    <div>\r\n        <input type=\"text\" ng-model=\"newPresent\">\r\n        <button\r\n            class=\"add-present-button\"\r\n            ng-click=\"addPresent({presents: newPlayer.data.presents, present: newPresent}); newPresent = \'\'\"\r\n        >+</button>\r\n    </div>\r\n</div>\r\n\r\n\r\n<div ng-if=\"key ===\'honours\'\" ng-repeat=\"(j, honour) in player[key] track by $index\">\r\n    <div  ng-repeat=\"(Key, honour) in honour\">\r\n        <span class=\"player-honour-key\">\r\n            {{::Key}} :\r\n        </span>\r\n        <span class=\"player-honour-value\">\r\n            {{::honour}}\r\n        </span>\r\n    </div>\r\n</div>\r\n</td>\r\n<td>\r\n    <button id=\"add-player-button\" ng-click=\"addPlayer({player: newPlayer.data})\">+</button>\r\n</td>");
$templateCache.put("pages/directives/period-selector.html","<select\r\n    class=\"rating-select\"\r\n    ng-model=\"periodType\">\r\n    <option\r\n        ng-repeat=\"(periodType, val) in filterFields\"\r\n        value=\"{{::periodType}}\"\r\n        >\r\n        {{::val.name}}\r\n    </option>\r\n</select>\r\n<select\r\n    class=\"rating-select\"\r\n    ng-model=\"period\"\r\n    ng-show=\"periodType !== \'year\'\"\r\n    ng-options=\"item as item.name for item in filterFields[periodType].value track by item.value\"\r\n    >\r\n</select>\r\n<select\r\n    class=\"rating-select\"\r\n    ng-model=\"year\"\r\n    ng-options=\"item as item.name for item in filterFields.year.value track by item.value\"\r\n    >\r\n</select>\r\n");}]);
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
angular.module('base').controller('newPlayerCtrl', ['$scope', 'CONFIG',
function($scope, CONFIG) {

    this.data = {
        presents: [],
        honours: []
    };

    $scope.inputTypes = CONFIG.inputTypes;
}]);
angular.module('base').controller('periodSelectorCtrl', ['$scope', 'CONFIG',
function($scope, CONFIG) {
    var today = new Date();
    $scope.filterFields = CONFIG.filterFields;

    $scope.periodType = 'month';
    $scope.period = getObjByValue(+today.toISOString().split('T')[0].split('-')[1], $scope.filterFields.month.value);
    $scope.year = getObjByValue(today.getUTCFullYear(), $scope.filterFields.year.value);

    $scope.$on('restore-defaults', restoreDefaults);
    $scope.$watch('periodType', defaultPeriod);


    // ======= PRIVATE ==========

    function getObjByValue(value, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == value) {
                return array[i];
            }
        }
    }

    var defaults = {
        periodType: $scope.periodType,
        period: $scope.period,
        year: $scope.year
    };

    function restoreDefaults() {
        $scope.periodType = defaults.periodType;
        $scope.period = defaults.period;
        $scope.year = defaults.year;
    }

    function defaultPeriod (periodType, oldPeriodType) {
        if (periodType === oldPeriodType) {
            return;
        }

        if (periodType === 'year') {
            $scope.period.value = '';
            return;
        }

        $scope.period = $scope.filterFields[periodType].value[0];
    }

}]);
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

angular.module('base')
.controller('playersCtrl',
['$scope', 'CONFIG', 'editService','serverService', 'dateFilter',
function($scope, CONFIG, editService,  serverService, dateFilter) {

    this.inputTypes = CONFIG.inputTypes;


    $scope.setPlayers = setPlayers;
    $scope.addNewPlayer = addNewPlayer;
    $scope.removeItem = editService.removeItem;
    $scope.addPresent = editService.addItem;
    $scope.startEdit = editService.startEdit;

    function setPlayers(players) {
        serverService.setItems(players, 'players');
    }

    function addNewPlayer (user) {
        console.log('[players.controller] addPlayer() ', arguments);
        var newPlayerObj = angular.copy(user);
        emptyUser(user);
        formatDate(newPlayerObj);
        editService.addItem($scope.players.data, newPlayerObj);
    }

    function emptyUser(user) {
        for(var key in user){
            user[key] = "";
        }
    }

    function formatDate(newPlayerObj) {
        newPlayerObj.birthday =  dateFilter(newPlayerObj.birthday, 'yyyy-MM-dd');
    }

}]);
angular.module('base').controller('RatingCtrl',
    ['$scope',
function($scope){
    $scope.$on('rating-request', restoreDefaults);

    this.getRating = getRating;

    // ====== METHODS =========
    function getRating () {
        $scope.fetchDataFor($scope.page, 0, {
            periodType: this.periodType,
            period: this.period.value,
            year: this.year.value
        });
    }

    // ======== PRIVATE =======
    function restoreDefaults() {
        $scope.$broadcast('restore-defaults');
    }

}]);
(function () {
    angular.module('base').controller('registerCtrl', ['$scope', 'serverService', registerCtrl]);

    function registerCtrl($scope, serverService) {
        console.log('[register.controller.js] registerCtrl()', arguments);
        var vm = this;

        // ========= INIT PART
        restoreDefaults();
        $scope.$on('register-request', restoreDefaults);
        $scope.$watch('date', function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            $scope.fetchDataFor(null, 3, {
                date: dateToStr($scope.date)
            });
        });


        vm.setRegister = setRegister;
        vm.getSum = getSum;
        vm.isValid = isValid;
        vm.playerNicks = [];

        // ========= METHODS =============
        function setRegister(register, date) {
            for (var i = 0; i < register.length; i++) {
                if (register[i].nick === null) {
                    register[i].nick = '';
                }
                if (register[i].sum === null) {
                    register[i].sum = 0;
                }
                if (register[i].debt === null) {
                    register[i].debt = 0;
                }

            }
            serverService.setItems(register, 'register', '/' + dateToStr(date) + '.json');
        }

        function getSum() {
            if (!$scope.register) {
                return;
            }
            return $scope.register.data.reduce(function (prev, cur) {
             return prev + cur.sum;
            }, 0);
        }

        function isValid() {
            if (!$scope.register) {
                return;
            }
            return $scope.register.data.reduce(function (prev, cur) {
                 return prev && cur.nick;
             }, true);
        }

        // ====== HELPERS ========
        function dateToStr(date) {
            return date.toISOString().split('T')[0];
        }

        function restoreDefaults() {
            $scope.date = new Date();
            serverService.$_fetchData({url:'players'}, 3).then(updateAutocomplete);
        }

        function updateAutocomplete(data) {
            vm.playerNicks = data.data.map(function(el) {
                return el.nick;
            });
        }
    }

})();

angular.module('base')
.directive("fileModel", [function () {
    return {
        scope: {
            fileModel: "="
        },
        link: function (scope, element) {
            console.log('[file-model] link:()', arguments);
            element.bind("change", function (changeEvent) {
                console.log('[file-model] element.bind()', arguments);
                if (changeEvent.target.files.length === 0) {
                    console.log('[cancel]', arguments);
                    scope.$apply(function () {
                        scope.fileModel = '';
                    });
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    console.log('[file-model] reader.onload()', arguments);
                    scope.$apply(function () {
                        scope.fileModel = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);
angular.module('base').directive('newPlayer', function(){

    return {
        scope: {
            fields:"=",
            addPlayer: "&",
            addPresent: "&",
            startEdit:'&',
            removeItem:'&'
        },
        controller: "newPlayerCtrl as newPlayer",
        restrict: 'A',
        templateUrl: 'pages/directives/new-player.html'
    };
});

angular.module('base').directive('periodSelector', function(){

    return {
        scope: {
            periodType: '=',
            period: '=',
            year: '=',
        },
        controller: "periodSelectorCtrl as periodSelectorCtrl",
        restrict: 'E',
        templateUrl: 'pages/directives/period-selector.html'
    };
});

angular.module('config')
.constant('CONFIG', {
    TEMPLATES_URL: 'pages',
    BASE_SERVER_URL: 'http://bs-mafiaclub.rhcloud.com/', //http://bs-mafiaclub.rhcloud.com/
    LOGIN_URL: 'login',
    SET_URL: 'set',
    inputTypes: {
        nick: 'text',
        password: 'password',
        vk: 'url',
        birthday: 'date',
        name: 'text',
        phone: 'tel',
        position: 'text',
        memberLevel: 'number',
        faculty: 'text',
        experiance: 'text'
    },
    filterFields: {
        "month":{
            name: "Месяц",
            value: [
            {
                value: 1,
                name: 'Январь'
            },{
                value: 2,
                name: 'Февраль'
            },{
                value: 3,
                name: 'Март'
            },{
                value: 4,
                name: 'Апрель'
            },{
                value: 5,
                name: 'Май'
            },{
                value: 6,
                name: 'Июнь'
            },{
                value: 7,
                name: 'Июль'
            },{
                value: 8,
                name: 'Август'
            },{
                value: 9,
                name: 'Сентябрь'
            },{
                value: 10,
                name: 'Октябрь'
            },{
                value: 11,
                name: 'Ноябрь'
            },{
                value: 12,
                name: 'Декабрь'
            }]
        },
        "year":{
            name: "Год",
            value: [
                {
                    value: 2015,
                    name: "2015 год"
                },{
                    value: 2016,
                    name: "2016 год"
                }
            ]
        },
        "season":{
            name: "Сезон",
            value: [
                {
                    value: 1,
                    name: 'Зима'
                },{
                    value: 2,
                    name: 'Весна'
                },{
                    value: 3,
                    name: 'Лето'
                },{
                    value: 4,
                    name: 'Осень'
                }
            ]
        }
    }
});
angular.module('base')
.constant('PAGES', [{

    // default page
    url: 'home',
    name: 'О нас',
    needMemberLevel: 0
},{
    url: 'news',
    name: 'Новости',
    needData: true,
    needMemberLevel: 0
},{
    url: 'rating',
    name: 'Рейтинг',
    controller: 'RatingCtrl as RatingCtrl',
    needData: true,
    needMemberLevel: 0
},{
    url: 'members',
    name: 'Члены клуба',
    needData: true,
    needMemberLevel: 0
},{
    url: 'hall_of_fame',
    name: 'Зал Славы',
    needData: true,
    needMemberLevel: 0
},{
    url: 'photos',
    name: 'Фото',
    controller: 'photosCtrl as photosCtrl',
    needData: true,
    needMemberLevel: 0
},{
    url: 'contacts',
    name: 'Контакты',
    needData: true,
    needMemberLevel: 0
},{
    url: 'protocols',
    name: 'Бланки',
    needMemberLevel: 3
},{
    url: 'players',
    name: 'Игроки',
    controller: 'playersCtrl as playersCtrl',
    needData: true,
    needMemberLevel: 3
},{
    url: 'contents',
    name: 'Контент',
    controller: 'contentsCtrl as contentsCtrl',
    needData: true,
    needMemberLevel: 3
},{
    url: 'register',
    name: 'Регистрация',
    controller: 'registerCtrl as registerCtrl',
    needData: true,
    needMemberLevel: 3
}]);
angular.module('server')
.service('editService', ['$http', 'CONFIG', 'dateFilter',
function editService ($http, CONFIG, dateFilter) {

    var editableField = null;
    var editablePlayer = null;
    angular.element(document).on('click', blurFocus);

    function startEdit($event, player, type) {
        console.log('[edit.service] startEdit()', arguments);

        type = type || 'text';
        var currentTarget = angular.element($event.toElement);
        console.log('currentTarget', currentTarget);
        if (currentTarget.attr('autofocus') === '') {
            return;
        }
        blurFocus($event);
        editableField = angular.element($event.toElement);
        console.log('editableField', editableField);
        var value = editableField.html().trim();

        if (type === 'date') {
            value = editableField.attr('date');
        }
        console.log('value', value);
        var input = angular.element('<input type="' + type + '" value="'+value+'" autofocus>');
        input.bind("keydown keypress", handleEnter);
        editablePlayer = player;
        editableField.html('');
        editableField.append(input);
    }

    function handleEnter(event) {
        if(event.which === 13) {
            blurFocus(event);
        }
    }


    function blurFocus($event) {
        console.log('[edit.service] blurFocus', arguments);

        var currentTarget = angular.element($event.toElement);
        if (currentTarget.attr('autofocus') === '') {
            return;
        }
        if (editableField && !angular.equals(editableField, currentTarget)) {
            stopEdit();
        }
    }

    function stopEdit () {
        console.log('[edit.service] stopEdit()', arguments);

        var input = editableField.find('input');
        input.unbind("keydown keypress", handleEnter);
        var newVal = input.val();


        if (input.attr('type') === 'date') {
            editableField.attr('date', newVal);
            newVal = dateFilter(newVal);
        }

        editableField.html(newVal);

        var key = editableField.attr('key');
        var iterator = editableField.attr('iterator');
        var clue = editableField.attr('clue');
        console.log('iterator = ', iterator);
        if (iterator) {
            if (clue) {
                editablePlayer[key][iterator][clue] = newVal;
            } else {
                editablePlayer[key][iterator] = newVal;
            }
        } else {
            editablePlayer[key] = newVal;
        }

        editableField = null;
        editablePlayer = null;
    }


    function removeItem (items, item) {
        var i = items.indexOf(item);
        items.splice(i,1);
    }

    function addItem (items, item) {
        console.log('[edit.service] additems()', arguments);
        items.push(item);
    }

    return {
        startEdit:  startEdit,
        removeItem:  removeItem,
        addItem:  addItem
    };

}]);
angular.module('server')
.service('serverService', ['$http', 'CONFIG', '$cookies',
    function serverService ($http, CONFIG, $cookies) {

    this.player = {
        data: {
            "nick": "",
            "password": "",
            "vk": "",
            "birthday": "",
            "name": "",
            "phone": "",
            "memberLevel": 0,
            "faculty": "",
            "experiance": ""
        }
    };
    this.player.data = $cookies.getObject('player-data') || this.player.data;

    serverService.prototype.$_fetchData = function(page, needMemberLevel, data) {
        console.log('[server.service] $_fetchData()', arguments);

        return $http.post(CONFIG.BASE_SERVER_URL + page.url, data)
        .catch(failCallback.bind(this, needMemberLevel))
        .then(handleData.bind(this, page));
    };

    serverService.prototype.$_login = function() {
        console.log('[server.service] $_login()', arguments);
        $cookies.putObject('player-data', this.player.data);

        return $http.post(CONFIG.BASE_SERVER_URL + CONFIG.LOGIN_URL, {
                credentials:{
                    user: this.player.data.nick,
                    password: this.player.data.password
                }
            })
            .catch(failCallback.bind(this, 0))
            .then(handleLogin.bind(this));
    };

    serverService.prototype.setItems = function(items, field, path) {
        console.log('[server.service] setPlayers()', items);
        var data = {
            field: field,
            data: items,
            path: path || '',
        };

        return $http.post(CONFIG.BASE_SERVER_URL + CONFIG.SET_URL, data)
            .catch(failCallback.bind(this, 0))
            .then(handleData.bind(this, field));
    };

    // ========== PRIVATE METHODS
    function failCallback (needMemberLevel, err) {
        console.log('[server.service] failCallback()', arguments);
        switch(err.status) {
            case 413:
                alert('Слишком большой файл картинки, пожалуйста выберите другой!');
                break;
            case -1:
               alert('Сервер недоступен. Проверьте интернет соединение и сообщите администратору');
                break;
            default:
            alert('Cообщие администратору об ошибке: ' + err.statusText);
        }
    }

    function handleLogin (response) {
        console.log('[server.service] handleLogin()', arguments);

        var data  = response.data;
        if (data.errorText) {
            alert(data.errorText);
        } else {
            this.player.data = data;
            $cookies.putObject('player-data', this.player.data);
        }
    }

    function handleData (page, response) {
        console.log('[base.controller] handleData()', arguments);

        if (!response) {
            return;
        }
        if (response.data.errorText) {
            angular.element(document.getElementById('view'))
                .css('visibility', 'hidden');
            alert(response.data.errorText);
            return {
                errorText: response.data.errorText
            };
        } else if(response.data.successText) {
            alert(response.data.successText);
        } else {
            angular.element(document.getElementById('view'))
                .css('visibility', 'visible');
            return response.data;
        }
    }
}]);


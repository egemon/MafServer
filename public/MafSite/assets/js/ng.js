angular.module('base', ['ui.router', 'server', 'ngAnimate', 'templates', 'ProtocolApp','ngCookies'],
  ['CONFIG', 'club','PAGES', '$stateProvider', '$urlRouterProvider',
  function generalConfig (CONFIG, club, PAGES, $stateProvider, $urlRouterProvider) {
    CONFIG.BASE_SERVER_URL = club.BASE_SERVER_URL = location.origin + '/';
    var tmplsUrl = CONFIG.TEMPLATES_URL;
    $urlRouterProvider.otherwise('/' + PAGES[0].url);

    for (var i = 0; i < PAGES.length; i++) {
      var page = PAGES[i];
      var url = '/' + page.url;

      // var name = page.name;
      $stateProvider.state(url, {
        url: '/' + page.url,
        templateUrl: tmplsUrl + url + '.html'
      });
    }
  }
]).run(['$rootScope', '$timeout', function generalRun ($rootScope, $timeout) {
  
    animateLogo($rootScope)

    function animateLogo ($scope) {
        $scope.logoClass = 'animating-started';
        $timeout(function () {
            $scope.logoClass = 'animating-ended';
        }, 1500);
    }
}]);
angular.module('config', []);
angular.module('server', ['config']);
try {
    angular.module('templates');
} catch(e) {
    angular.module('templates', []);
}

angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("base.html","<!DOCTYPE html>\n<html lang=\"en\" ng-app=\"base\" ng-strict-di>\n<head>\n    <meta charset=\"UTF-8\">\n    <title>BakerStreet 221b Mafia Club</title>\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"public/MafSite/assets/css/base.min.css\">\n</head>\n<body id=\"page-container\" ng-controller=\"baseCtrl\" ng-click=\"blurFocus($event)\">\n    <header id=\"header\">\n        <div class=\"page-title-container\">\n            <a id=\"page-logo-ref\" ui-sref=\"{{\'/\' + PAGES[0].url}}\" ng-click=\"setPage(PAGES[0])\">\n                <img src=\"public/MafSite/assets/img/main_logo.png\" alt=\"BakerLogo\" id=\"pageLogo\" ng-class=\"logoClass\" >\n            </a>\n            <div id=\"page-title\">\n                \"Baker Street 221b\" Mafia Club\n            </div>\n        <login-form ng-include=\"\'pages/partials/loginForm.html\'\"></login-form>\n        </div>\n        <nav>\n            <ul class=\"main-menu\">\n                <li class=\"main-menu-item\" ng-repeat=\"(i, thisPage) in PAGES\" ng-class=\"{current:thisPage == page}\" ng-show=\"user.data.memberLevel >= thisPage.needMemberLevel\">\n                    <a class=\"main-menu-ref\" ui-sref=\"{{\'/\' + thisPage.url}}\" ng-click=\"setPage(thisPage)\">\n                        {{thisPage.name}}\n                    </a>\n                </li>\n            </ul>\n        </nav>\n    </header>\n    <main ui-view id=\"view\">\n    </main>\n\n\n    <script src=\"public/MafSite/assets/js/main.min.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n</body>\n</html>");
$templateCache.put("pages/contacts.html","<div\n    class=\"player\"\n    id=\"top0-player\"\n    ng-repeat=\"(i, player) in contacts\"\n    ng-include=\"\'pages/partials/player.html\'\">\n</div>");
$templateCache.put("pages/error.html","Error!\n<%err%>");
$templateCache.put("pages/hall_of_fame.html","<div class=\"top-block\">\n    <div ng-repeat=\"(i, period) in hall_of_fame\">\n        <title class=\"top-title\">{{period.title}}</title>\n        <div id=\"top-players\">\n            <div ng-repeat=\"(j, player) in period.honours\" class=\"player\" id=\"top{{j+1}}-player\" ng-include=\"\'pages/partials/player.html\'\">\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("pages/home.html","<article>\n    <p>\n        Клуб мафии Киевского Национального Университета им.Т. Шевченко Baker Street 221b проводит игры в течении 5 лет,\n        являясь членом Студенческой Лиги Игры Мафия (СЛИМ) Федерации Интеллектуальной Игры Мафия(ФИИМ).\n    </p>\n    <p>\n        Подарок от клуба для всех именинников - бесплатное посещение следующей встречи после Вашего дня рождения.\n    </p>\n    <p>\n        Коллектив организаторов желает Вам приятных и интересных игр!\n    </p>\n    <p>\n        PS: Чтобы получать приглашения на встречи и быть в курсе всех событий из жизни клуба, вступайте в <a href=\"https://vk.com/baker_street_mafia_club\" target=\"_blank\"> нашу группу</a>\n    </p>\n    <p>\n        Добро пожаловать в Игру!\n    </p>\n</article>\n");
$templateCache.put("pages/members.html","<div class=\"top-block\">\n    <div id=\"top-players\">\n        <div ng-repeat=\"(i, player) in members\" class=\"player\" id=\"top0-player\" ng-include=\"\'pages/partials/player.html\'\">\n        </div>\n    </div>\n</div>\n");
$templateCache.put("pages/news.html","<article ng-repeat=\"(i, new) in news\">\n    <title>{{new.number}}ая встреча. Ждем Вас!</title>\n    <p>\n       Традиционно приглашаем Вас на <a href=\"https://vk.com/bs_vstrecha_{{new.number}}\" target=\"_blank\">встречу клуба</a> мафии Baker Street 221b!\n    </p>\n    <p>\n       Что? - {{new.what}}\n    </p>\n    <p>\n      Где? -\n      <a href=\"https://goo.gl/oFev5u\">\n       {{new.where}}\n      </a>\n    </p>\n    <p id=\"when{{i}}\">\n       Когда? - {{new.when | date}}\n    </p>\n    <p>\n       Члеский взнос? - {{new.price}} за вечер игр\n    </p>\n    <p>\n      С уважением, команда организаторов.\n    </p>\n</article>");
$templateCache.put("pages/photos.html","<div class=\"photo\" ng-repeat=\"(i, photo) in photos\">\n    <a href=\"{{photo.href}}\" title=\"{{photo.title}}\" target=\"_blank\">\n        <img class=\"photo-logo\"\n        onerror=\"this.src=\'../img/main_logo_black2.png\'; this.onerror=\'\'\"\n        ng-src=\"{{photo.src}}\"\n        alt=\"{{photo.title}}\"\n        >\n    </a>\n    <p class=\"photo-title\">{{photo.title}}</p>\n    <p class=\"photo-date\">{{photo.date}}</p>\n</div>");
$templateCache.put("pages/players.html","<players players=\"players\">\n\n</players>");
$templateCache.put("pages/protocols.html","<protocol></protocol>");
$templateCache.put("pages/rating.html","<table class=\"table table-bordered\" id=\"ratingTable\" border=\'1\'>\n  <thead>\n    <tr>\n      <th>Фото</th>\n      <th>Ник</th>\n      <th>Сумма</th>\n      <th>Игр</th>\n      <th>Среднее</th>\n      <th>Лучшие от игроков</th>\n      <th>Лучшие от Судей</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class=\"rating-row\" id=\"{{player.name}}\" ng-repeat=\"(i, player) in rating\">\n      <td id=\"{{player.avatar}}\">\n        <img class=\"playerAvatarInRating\"\n        onerror=\"this.src=\'public/MafSite/assets/img/main_logo.png\'; this.onerror=\'\'\"\n        ng-src=\"data-base/players/img/{{player.name}}.jpg\"\n        alt=\"\">\n      </td>\n      <td>{{player.name}}</td>\n      <td>{{player.sum}}</td>\n      <td>{{player.gameNumber}}</td>\n      <td>{{player.sum / player.gameNumber | number:2}}</td>\n      <td>{{player.BP}}</td>\n      <td>{{player.BR}}</td>\n    </tr>\n  </tbody>\n</table>\n<script src=\"../js/plain/rating.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n");
$templateCache.put("pages/directives/new-player.html","<td ng-repeat=\"(i, key) in fields\">\n<input\n    type=\"{{::newPlayer.types[key]}}\"\n    key=\"{{::key}}\"\n    ng-if=\"key !== \'presents\' && key !== \'honours\'\"\n    ng-model=\"newPlayer.data[key]\"\n>\n</input>\n<div class=\"hint\">\n    Данные некорректны! Проверьте.\n</div>\n\n\n<!-- presents container -->\n<div\n    ng-if=\"key ===\'presents\'\"\n    class=\"player-present\"\n    data=\"{{::newPlayer.data.presents}}\"\n>\n    <!-- player-continer in repeate -->\n    <div\n        ng-repeat=\"(j, present) in newPlayer.data.presents track by $index \"\n    >\n        <span\n            data={{::present}}\n            key=\"presents\"\n            j=\"{{::j}}\"\n            ng-click=\"startEdit({$event: $event, player: newPlayer.data})\"\n        >\n            {{::present}}\n        </span>\n        <button class=\"remove-present-button\" ng-click=\"removeItem({items: newPlayer.data.presents, item: present})\">-</button>\n    </div>\n\n    <!--  new present container-->\n    <div>\n        <input type=\"text\" ng-model=\"newPresent\">\n        <button\n            class=\"add-present-button\"\n            ng-click=\"addPresent({presents: newPlayer.data.presents, present: newPresent})\"\n        >+</button>\n    </div>\n</div>\n\n\n<div ng-if=\"key ===\'honours\'\" ng-repeat=\"(j, honour) in player[key] track by $index\">\n    <div  ng-repeat=\"(Key, honour) in honour\">\n        <span class=\"player-honour-key\">\n            {{::Key}} :\n        </span>\n        <span class=\"player-honour-value\">\n            {{::honour}}\n        </span>\n    </div>\n</div>\n</td>\n<td>\n    <button id=\"add-player-button\" ng-click=\"addPlayer({player: newPlayer.data})\">+</button>\n</td>");
$templateCache.put("pages/directives/players.html","<table class=\"table players-table table-hover\">\n    <thead>\n        <tr>\n            <th ng-repeat=\"(j, field) in players.fields\">{{::field}}</th>\n        </tr>\n    </thead>\n    <tbody ng-init=\"addBlurListener()\">\n        <tr ng-repeat=\"(i, player) in players.data\" ng-include=\"\'pages/partials/player-tr.html\'\">\n        </tr>\n        <tr>\n            <tr new-player\n                add-present=\"addPresent(presents, present)\"\n                fields=\"players.fields\"\n                add-player=\"addNewPlayer(player)\"\n                start-edit=\"startEdit($event, player)\"\n                remove-item=\"removeItem(items, item)\"\n            ></tr>\n        </tr>\n    </tbody>\n</table>\n<button ng-click=\"setPlayers(players.data)\">Изменить данные</button>");
$templateCache.put("pages/partials/loginForm.html","<div>\n    <button class=\"form-button\" id=\'showLogin\' ng-click=\"isOrg = !isOrg\">Логин</button>\n    <div id=\"authform\" ng-show=\"isOrg == true\">\n        <input class=\"form-input\" id=\"user\" type=\"text\" placeholder=\"Ник\" ng-model=\"user.data.nick\">\n        <input class=\"form-input\" id=\"password\" type=\"password\" placeholder=\"Пароль\" ng-model=\"user.data.password\">\n        <button\n            id=\"authButton\"\n            class=\"form-button\"\n            ng-click=\"login(user)\">\n            Войти\n        </button>\n    </div>\n</div>");
$templateCache.put("pages/partials/player-tr.html","<td ng-repeat=\"(j, key) in players.fields\" >\n<div\n    class=\"player-input\"\n    key=\"{{::key}}\"\n    ng-if=\"key !== \'presents\' && key !== \'honours\' && key !== \'birthday\'\"\n    ng-click=\"startEdit($event, player)\"\n>\n    {{::player[key]}}\n</div>\n\n<div\n    class=\"player-input\"\n    key=\"{{::key}}\"\n    date=\"{{::player[key]}}\"\n    ng-if=\"key === \'birthday\'\"\n    ng-click=\"startEdit($event, player, \'date\')\"\n>\n    {{::player[key] | date}}\n</div>\n\n<div\n    class=\"player-presents-container\"\n    ng-if=\"key ===\'presents\'\"\n    data=\"{{::player.presents}}\"\n>\n    <div\n        ng-repeat=\"(j, present) in player[key] track by $index \"\n        data={{::present}}\n        key=\"presents\"\n        j=\"{{::j}}\"\n        ng-click=\"startEdit($event, player)\"\n    >\n        {{::present}}\n        <button class=\"remove-present-button\" ng-click=\"removeItem(player.presents, present)\">-</button>\n    </div>\n    <div>\n        <input type=\"text\" ng-model=\"newPresent\">\n        <button\n            class=\"add-present-button\"\n            ng-click=\"addPresent(player.presents, newPresent)\"\n        >+</button>\n    </div>\n</div>\n\n<div\n    ng-if=\"key ===\'honours\'\"\n    ng-repeat=\"(j, honour) in player[key] track by $index\"\n>\n    <div\n        ng-repeat=\"(Key, honour) in honour\"\n    >\n        <span class=\"player-honour-key\">\n            {{::Key}} :\n        </span>\n        <span class=\"player-honour-value\">\n            {{::honour}}\n        </span>\n    </div>\n</div>\n</td>\n<td>\n    <button id=\"remove-player-button\" ng-click=\"removeItem(players.data, player)\">-</button>\n</td>\n");
$templateCache.put("pages/partials/player.html","<img\n    class=\"player-logo\"\n    ng-src=\"data-base/players/img/{{player.img}}.jpg\"\n    alt=\"{{player.nick}}\"\n    ng-click=\"openNewTab(player.vk)\"\n    vk={{player.vk}}\n>\n<div class=\"player-text-container\">\n    <p class=\"player-nick\">{{player.nick}}</p>\n    <p class=\"player-faculty\">{{player.name}}</p>\n    <p class=\"player-results\" ng-show=\"player.avr\">{{player.avr + \' средний бал \'}}{{\'(\' + player.gameNumber + \' игр)\'}}</p>\n    <p class=\"player-faculty\">{{player.position}}</p>\n    <p class=\"player-faculty\">{{player.faculty}}</p>\n    <p class=\"player-exp\">{{player.experiance}}</p>\n    <p class=\"player-faculty\" ng-show=\"player.position\">{{player.phone}}</p>\n    <div class=\"honours\">\n        <div\n        ng-repeat=\"(j, honour) in player.honours\"\n        title=\"{{honour.title}}\"\n        class=\"{{honour.type}}-{{honour.place}} honour\"\n        ></div>\n    </div>\n</div>\n");}]);
angular.module('config')
.constant('CONFIG', {
    TEMPLATES_URL: 'pages',
    BASE_SERVER_URL: 'http://bs-mafiaclub.rhcloud.com/', //http://bs-mafiaclub.rhcloud.com/
    LOGIN_URL: 'login',
    SET_PLAYERS_URL: 'setplayers'
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
    needData: true,
    needMemberLevel: 3
}]);
angular.module('base')
.controller('baseCtrl',
['PAGES', '$scope', 'serverService', '$timeout', '$window', '$location',
function(PAGES, $scope, serverService, $timeout, $window, $location) {

    var pageUrl = $location.path().slice(1);
    var firstPage = findPageByUrl(pageUrl) || PAGES[0];
    setPage(firstPage);
    $scope.PAGES = PAGES;
    $scope.isOrg = false;
    $scope.user = serverService.player;

    $scope.login = login;
    $scope.setPage = setPage;
    $scope.openNewTab =  openNewTab;

    // ===== public methods
    function login (user) {
        console.log('[base.controller] login()', arguments);

        serverService.$_login(user);
    }

    function setPage (page) {
        console.log('[base.controller] setPage()', arguments);

        $scope.page = page;
        if (page.needData) {
            fetchDataFor(page, page.needMemberLevel);
        }
    }

    function openNewTab (url) {
        console.log('[base.controller] openNewTab()', arguments);

        if (url) {
            $window.open(url, '_blank');
        }
    }

    // ===== private mehtods

    function fetchDataFor (page, needMemberLevel) {
        console.log('[base.controller] fetchDataFor()', arguments);

        return serverService.$_fetchData(page, needMemberLevel)
            .catch(handleError.bind(this, page))
            .then(attchDataToScope.bind(this, $scope, page));
    }


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
angular.module('base').controller('newPlayerCtrl', ['$scope',
function() {
    this.types = {
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
    };

    this.data = {
        presents: [],
        honours: []
    };

}]);
angular.module('base')
.controller('playersCtrl', ['$scope', 'serverService', 'dateFilter', function($scope, serverService, dateFilter){
    var editableField = null;
    var editablePlayer = null;

    $scope.startEdit =  startEdit;
    $scope.blurFocus =  blurFocus;
    $scope.addPresent =  addPresent;

    $scope.setPlayers =  setPlayers;
    $scope.addBlurListener =  addBlurListener;
    $scope.addNewPlayer =  addNewPlayer;
    $scope.removeItem =  removeItem;


    function handleEnter(event) {
        if(event.which === 13) {
            blurFocus(event);
        }
    }

    function addPresent (presents, newPresent) {
        console.log('[players.controller] addPresents()', arguments);
        presents.push(newPresent);
    }

    function startEdit($event, player, type) {
        console.log('[players.controller] startEdit()', arguments);
        type = type || 'text';
        var currentTarget = angular.element($event.toElement);
        if (currentTarget.attr('autofocus') === '') {
            return;
        }
        blurFocus($event);
        editableField = angular.element($event.toElement);
        var value = editableField.html().trim();

        if (type === 'date') {
            value = editableField.attr('date');
        }

        var input = angular.element('<input type="' + type + '" value="'+value+'" autofocus>');
        input.bind("keydown keypress", handleEnter);
        editablePlayer = player;
        editableField.html('');
        editableField.append(input);
    }

    function blurFocus($event) {
        console.log('blurFocus', arguments);
        var currentTarget = angular.element($event.toElement);
        if (currentTarget.attr('autofocus') === '') {
            return;
        }
        if (editableField && !angular.equals(editableField, currentTarget)) {
            stopEdit();
        }
    }

    function stopEdit () {
        console.log('stopEdit()', arguments);

        var input = editableField.find('input');
        input.unbind("keydown keypress", handleEnter);
        var newVal = input.val();


        if (input.attr('type') === 'date') {
            editableField.attr('date', newVal);
            newVal = dateFilter(newVal);
        }

        editableField.html(newVal);

        var key = editableField.attr('key');
        var iterator = editableField.attr('j');
        if (iterator) {
            editablePlayer[key][iterator] = newVal;
        } else {
            editablePlayer[key] = newVal;
        }

        editableField = null;
        editablePlayer = null;
    }

    function setPlayers(players) {
        serverService.setPlayers(players);
    }

    function addBlurListener () {
        angular.element(document).on('click', blurFocus);
    }

    function addNewPlayer (user) {
        console.log('[players.controller] addPlayer() ', arguments);
        var newPlayerObj = angular.copy(user);
        _emptyUser(user);
        newPlayerObj.birthday =  dateFilter(newPlayerObj.birthday, 'yyyy-MM-dd');
        $scope.players.data.push(newPlayerObj);
    }

    function removeItem (players, player) {
        var i = players.indexOf(player);
        players.splice(i,1);
    }


    function _emptyUser(user) {
        for(var key in user){
            user[key] = "";
        }
    }

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

angular.module('base').directive('players', function(){

	return {
		scope: {
			players: "="
		},
		controller: "playersCtrl",
		restrict: 'E',
		templateUrl: 'pages/directives/players.html'
	};
});

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

    console.log('this.player.data', this.player.data);
    serverService.prototype.$_fetchData = function(page, needMemberLevel) {
        console.log('[server.service] $_fetchData()', arguments);


        return $http.post(CONFIG.BASE_SERVER_URL + page.url,
            needMemberLevel ? {
                user: this.player.data.nick,
                password: this.player.data.password
            } : '')
        .catch(failCallback.bind(this, needMemberLevel))
        .then(handleData.bind(this, page));
    };

    serverService.prototype.$_login = function() {
        console.log('[server.service] $_login()', arguments);

        return $http.post(CONFIG.BASE_SERVER_URL + CONFIG.LOGIN_URL, {
                user: this.player.data.nick,
                password: this.player.data.password
            })
            .catch(failCallback.bind(this))
            .then(handleLogin.bind(this));
    };

    serverService.prototype.setPlayers = function(players) {
        console.log('[server.service] setPlayers()', players);

        return $http.post(CONFIG.BASE_SERVER_URL + CONFIG.SET_PLAYERS_URL, {
                user: this.player.data.nick,
                password: this.player.data.password,
                players: players
            })
            .catch(failCallback.bind(this))
            .then(handleData.bind(this, 'players'));
    };

    // ========== PRIVATE METHODS
    function failCallback (needMemberLevel, err) {
        console.log('[server.service] failCallback()', err);
        if (err && err.status === -1) {
            alert('Сервер недоступен. Проверьте интернет соединение и сообщите администратору');
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
        } else if(response.data.succesText) {
            alert(response.data.succesText);
        } else {
            angular.element(document.getElementById('view'))
                .css('visibility', 'visible');
            return response.data;
        }
    }
}]);


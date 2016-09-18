angular.module('base')
.service('serverService', function serverService ($http, CONFIG, $cookies, $rootScope, serverHelper) {
    var player = {
        data: {
            "nick": "",
            "password": "",
            "vk": "",
            "birthday": "",
            "name": "",
            "phone": "",
            "memberlevel": 0,
            "faculty": "",
            "experiance": ""
        }
    };
    player.data = $cookies.getObject('player-data') || player.data;
    return {
        $_fetchData: $_fetchData,
        $_login: $_login,

        create: create,
        read: read,
        update: update,
        delete: remove,

        savePlayerImage: savePlayerImage,
        player: player,
    };

    function $_fetchData(page, data) {
        console.log('[server.service] $_fetchData()', arguments);


        // PG ONLY
        if (page.url === 'players') {
            return read('players', 'all', {'order by': 'nick asc'});
        }

        if (page.url === 'contents') {
            return read('news', 'all', {'order by': 'date desc'});
        }

        if (page.url === 'news') {
            return read('news', 'all', {'order by': 'date desc'});
        }

        if (page.url === 'members') {
            return read('players', {memberlevel: ' >= 1'}, {'order by': 'nick asc'});
        }

        if (page.url === 'contacts') {
            return read('players',  {memberlevel: ' = 3'}, {'order by': 'memberlevel asc'});
        }

        if (page.url === 'photos') {
            return read('photos', 'all', {'order by': 'date desc'});
        }
        if (page.url === 'rating') {
            return read('rating', 'all', data);
        }
        if (page.url === 'games') {
            return read('games', 'all', data);
        }


        if (page.url === 'hall_of_fame') {
            return read('honours', 'all').then(function (data) {
                data = serverHelper.getHallOfFame(data);
                return data;
            });
        }

        alert('Client issue! Please contact admin');
    };

    function $_login() {
        console.log('[server.service] $_login()', arguments);
        $cookies.putObject('player-data', player.data);

        return $http.post(CONFIG.BASE_SERVER_URL + CONFIG.LOGIN_URL, {
                credentials:{
                    user: player.data.nick,
                    password: player.data.password
                }
            })
            .catch(failCallback.bind(self, 0))
            .then(handleLogin.bind(self));
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
        return {data:[]};
    }

    function handleLogin (response) {
        console.log('[server.service] handleLogin()', arguments);

        var data  = response.data;
        if (data.errorText) {
            alert(data.errorText);
        } else {
            player.data = data;
            $cookies.putObject('player-data', player.data);
        }
    }

    function handleData (config, response) {
        console.log('[base.controller] handleData()', arguments);
        return response.data;
    }


    // =============== PG ONLY ====================


    function create(table, items) {
        console.log('[server.service] create()', arguments);

        var data = {
            table: table,
            items: removeNulls(items),
        };

        return $http({
            method: 'POST',
            url: CONFIG.BASE_SERVER_URL + CONFIG.DATA_URL,
            data: data,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
        .catch(failCallback.bind(this, 0))
        .then(handleData.bind(this, table));
    };

    function read(table, ids, params, credentials) {
        console.log('[server.service] create()', arguments);

        var data = {
            table: table,
            ids: ids,
            options: params,
            credentials: getCredentials(player.data)
        };

        return $http({
            method: 'GET',
            url: CONFIG.BASE_SERVER_URL + CONFIG.DATA_URL,
            params: data,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
        .catch(failCallback.bind(this, 0))
        .then(handleData.bind(this, data))
        .then(function (data) {
            $rootScope.$broadcast('data-fetched', data);
            return data;
        });
    };

    function update(table, items, ids) {
        console.log('[server.service] create()', arguments);

        var data = {
            table: table,
            items: removeNulls(items),
            ids: ids
        };

        return $http({
            method: 'PATCH',
            url: CONFIG.BASE_SERVER_URL + CONFIG.DATA_URL,
            data: data,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
        .catch(failCallback.bind(this, 0))
        .then(handleData.bind(this, table));
    };

    function remove(table, ids) {
        console.log('[server.service] remove()', ids);

        var data = {
            table: table,
            ids: ids
        };

        return $http({
            method: 'DELETE',
            url: CONFIG.BASE_SERVER_URL + CONFIG.DATA_URL,
            data: data,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
        .catch(failCallback.bind(this, 0))
        .then(handleData.bind(this, table));
    };

    function savePlayerImage(id, nick, base64) {
        console.log('[server.service] savePlayerImage()', nick);

        var data = {
            id: id,
            nick: nick,
            base64: base64,
            credentials: getCredentials(player.data)
        };

        return $http({
            method: 'POST',
            url: CONFIG.STATIC_URL + '/data',
            data: data,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
            .catch(failCallback.bind(this, 0));
    };

    function removeNulls(item) {
        return _.mapValues(item, function (val, key) {

        if (!val && _.includes(key, 'date')) {
            return '01/01/01';
        }

        if (val === 0) {
            return val;
        } else {
            return val || undefined;
        }

        });
    }

    function getCredentials (player) {
        return {
            nick: player.nick,

            //TODO: remove after static fix
            user: player.nick,
            password: player.password,
        }
    }

});


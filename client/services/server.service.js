angular.module('server')
.service('serverService', ['$http', 'CONFIG', '$cookies', '$rootScope',
    function serverService ($http, CONFIG, $cookies, $rootScope) {

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


        // PG ONLY
        if (page.url === 'players') {
            return this.read('players', 'all');
        }

        if (page.url === 'contents') {
            return this.read('news', 'all');
        }

        if (page.url === 'news') {
            return this.read('news', 'all');
        }

        // if (page.url === 'members') {
        //     return this.read('players', {memberLevel:1});
        // }

        // TODO remove after PG
        var body = {
            pg:true,
            data: data
        };
        return $http.post(CONFIG.BASE_SERVER_URL + page.url, body)
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
            pg: true,
            field: field,
            data: removeNulls(items),
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


        // PG CHECK
        if (response.data.success) {
            // alert('Succsess');
            return response.data.data;
        } else if (response.data.success === 0){
            alert('Fail!');
            throw response;
        }

        $rootScope.$broadcast('data-fetched', response.data);



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
            return response.data;
        } else {
            angular.element(document.getElementById('view'))
                .css('visibility', 'visible');
            return response.data;
        }
    }


    // =============== PG ONLY ====================


    serverService.prototype.create = function(table, items) {
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

    serverService.prototype.read = function(table, ids) {
        console.log('[server.service] create()', arguments);

        var data = {
            table: table,
            ids: ids
        };

        return $http({
            method: 'GET',
            url: CONFIG.BASE_SERVER_URL + CONFIG.DATA_URL,
            params: data,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
        .catch(failCallback.bind(this, 0))
        .then(handleData.bind(this, table));
    };

    serverService.prototype.update = function(table, items, ids) {
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

    serverService.prototype.delete = function(table, ids) {
        console.log('[server.service] delete()', ids);

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


    function removeNulls(item) {
        return _.mapValues(item, function (val) {
        if (val === 0) {
            return val;
        } else {
            return val || undefined;
        }
        });
    }

}]);


angular.module('sync')
.factory('sync', ['$http', 'club', syncService]);

function syncService ($http, club) {

    return {
        push: pushToServer,
        pull: pullFromServer,
        delete: deleteFromServer,
        getNicks: getNicks
    };

    function alertErrorText(response) {
        console.log('[syncService] alertErrorText()', arguments);
        if (response.data.errorText) {
            alert(response.data.errorText);
            return club.defaultGame;
        }
        return response.data;
    }

    function formatGame(game) {
        console.log('[sync.factory] formatGame() ', arguments);

        var newGame = angular.copy(game);
        formatDate(newGame.metadata);

        for (var i = 0; i < newGame.playerLines.length; i++) {
            var player = newGame.playerLines[i];
            if (!player.BP) {
                delete player.BP;
            }
            if (!player.BR) {
                delete player.BR;
            }
            if (!player.falls) {
                delete player.falls;
            }

        }
        return newGame;
    }

    function formatDate (metadata) {
        metadata.date = moment(metadata.date).format('YYYY-MM-DD');
        return metadata;
    }

    function pushToServer (game, force, ids) {
        var body = {
            force: force,
            game: formatGame(game),
            ids: ids,
        };
        return $http.post(club.BASE_SERVER_URL + club.SYNC_URL, body)
            .then(alertErrorText);
    }

    function pullFromServer(metadata) {
        metadata = angular.copy(metadata);
        return $http.post(club.BASE_SERVER_URL + club.LOAD_URL, formatDate(metadata))
            .then(alertErrorText);
    }

    function deleteFromServer(game, force) {
        var metadata = formatDate(angular.copy(game.metadata));
        return $http.post(club.BASE_SERVER_URL + club.DELETE_URL, {
                metadata: metadata,
                force: force,
            })
            .then(alertErrorText);
    }

    function getNicks() {
        return $http.get(club.BASE_SERVER_URL + 'data', {params: {table:'players'}}).then(function (data) {
            console.log('[sync.factory] getNicks() data ', arguments);
            var players =  data.data.data;
            return players.map(function(el) {
                return el.nick;
            });
        }, function (err) {
            alert(err);
        });
    }

}
angular.module('ProtocolApp')
.factory('gameService', gameService);

function gameService ($http, $q, club, serverService) {

    //TODO: make it global value
    var players = [];

    return {
        push: pushToServer,
        pull: pullFromServer,
        delete: deleteFromServer,
        getNicks: getNicks
    };

    function alertErrorText(response) {
        console.log('[gameService] alertErrorText()', arguments);
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
        var formattedGame = formatGame(game);
        var body = {
            force: force,
            game: formattedGame,
            ids: ids,
        };
        var newPlayers =
            _.chain(formattedGame.playerLines)
                .differenceBy(players, 'nick')
                .map(function (player) {
                    return _.pick(player, 'nick');
                })
                .value();

        var gamePromise = $http.post(club.BASE_SERVER_URL + club.SYNC_URL, body)
            .then(alertErrorText);
        var playersPromise = $http.post(club.BASE_SERVER_URL + 'data', {
            table: 'players',
            items: newPlayers,
        })
            .then(alertErrorText);
        return $q.all(gamePromise, playersPromise);

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
        return serverService.read('players', 'all').then(function (players) {
            console.log('[sync.factory] getNicks() data ', arguments);
            return players.map(function(el) {
                return el.nick;
            });
        });
    }

}
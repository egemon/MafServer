angular.module('ProtocolApp')
.controller('ProtocolCtrl', ProtocolCtrl);

function ProtocolCtrl ($scope, $http, gameService, club, game) {
    console.log('ProtocolCtrl init');

    // ========== INIT BLOCK ===========
    var vm = this;
    gameService.getNicks().then(function (nicks) {
        vm.playerNicks = nicks;
    });

    //========== PUBLIC FIELDS ========
    vm.game = game;
    vm.ROLES = club.ROLES;
    vm.MAX_FALLS = club.MAX_FALLS;
    vm.TABLES = club.TABLES;
    vm.WIN = club.WIN;
    vm.playerNicks = [];
    vm.ids = [];

    //========== PUBLIC API ========
    vm.saveGame = saveGame;
    vm.loadGame = loadGame;
    vm.deleteGame = deleteGame;


    // ============ PUBLIC FUNCTIONS ========
    function saveGame () {
        console.log('PROTOCOL saveGame()', vm.game);
        gameService.push(vm.game)
            .then(handlePrompt.bind(this, 'push'))
            .then(restoreDefaults);
    }

    function loadGame() {
        gameService.pull(vm.game.metadata).then(handleLoadedGame.bind(this, vm.game));
    }

    function deleteGame () {
        console.log('PROTOCOL deleteGame()', vm.game);
        gameService.delete(vm.game)
            .then(handlePrompt.bind(this, 'delete'));
    }

    // ============ PRIVATE FUNCTIONS ========

    function restoreDefaults() {
        console.log('[PROTOCOL restoreDefaults()]', arguments);
        var newGame = angular.copy(club.defaultGame);
        newGame.metadata = vm.game.metadata;
        handleLoadedGame(vm.game, club.defaultGame);
    }

    function handlePrompt(cmd, data) {
        vm.ids = data.ids;
        if (data.confirmText) {
            if (window.confirm(data.confirmText)) {
                gameService[cmd](vm.game, true, vm.ids)
                .then(function () {
                    if (cmd !== 'delete') {
                        return restoreDefaults(cmd);
                    }
                });
            }
        }
    }

    function handleLoadedGame (oldGame, newGame) {
        console.log('[protocol.controller] handleLoadedGame() ', oldGame, newGame);
        loadMetadata(oldGame.metadata, newGame.metadata);
        loadPlayerLines(oldGame.playerLines, newGame.playerLines);
        if (newGame.days) {
            loadDays(oldGame.days, newGame.days);
        }
    }

    function loadMetadata(oldMetadata, newMetadata) {
        for(var key in newMetadata) {
            if (key === 'date') {
                continue;
            }
            oldMetadata[key] = newMetadata[key] || club.defaultMetadata[key];
        }
    }

    function loadPlayerLines (oldPlayers, newPlayers) {
        newPlayers.forEach(function(newPlayer, i) {
            var oldPlayer = oldPlayers[i];
            for(var key in oldPlayer) {
                oldPlayer[key] = newPlayer[key] || club.defaultPlayer[key];
            }
        });
    }

    function loadDays (oldDays, newDays) {
        oldDays.length = 0;
        newDays.forEach(function(newDay) {
            oldDays.push(newDay);
        });
    }
}
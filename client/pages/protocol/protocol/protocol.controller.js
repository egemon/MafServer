angular.module('ProtocolApp')
.controller('ProtocolCtrl', ['$scope', '$http', 'sync','club', 'game', ProtocolCtrl]);

function ProtocolCtrl ($scope, $http, sync, club, game) {
    console.log('ProtocolCtrl init');

    // ========== INIT BLOCK ===========
    var vm = this;
    sync.getNicks().then(function (nicks) {
        vm.playerNicks = nicks;
    });

    //========== PUBLIC FIELDS ========
    vm.game = game;
    vm.ROLES = club.ROLES;
    vm.MAX_FALLS = club.MAX_FALLS;
    vm.TABLES = club.TABLES;
    vm.WIN = club.WIN;
    vm.playerNicks = [];

    //========== PUBLIC API ========
    vm.saveGame = saveGame;
    vm.loadGame = loadGame;
    vm.deleteGame = deleteGame;


    // ============ PUBLIC FUNCTIONS ========
    function saveGame () {
        console.log('PROTOCOL saveGame()', vm.game);
        sync.push(vm.game)
            .then(handlePrompt.bind(this, 'push'));
    }

    function loadGame() {
        sync.pull(vm.game.metadata).then(handleLoadedGame.bind(this, vm.game));
    }

    function deleteGame () {
        console.log('PROTOCOL deleteGame()', vm.game);
        sync.delete(vm.game)
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
        if (data.confirmText) {
            if (window.confirm(data.confirmText)) {
                var promise = sync[cmd](vm.game, true);
                if (cmd === 'push') {
                    promise.then(restoreDefaults);
                }
            }
        }
    }

    function handleLoadedGame (oldGame, newGame) {
        console.log('[protocol.controller] handleLoadedGame() ', oldGame, newGame);
        loadMetadata(oldGame.metadata, newGame.metadata);
        loadPlayerLines(oldGame.playerLines, newGame.playerLines);
        loadDays(oldGame.days, newGame.days);
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
            console.log('[protocol.controller.js] loadPlayerLines() oldPlayer = ', oldPlayer);
            console.log('[protocol.controller.js] loadPlayerLines() newPlayer = ', newPlayer);
            for(var key in oldPlayer) {
                console.log('[protocol.controller.js] loadPlayerLines() key = ', key);
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
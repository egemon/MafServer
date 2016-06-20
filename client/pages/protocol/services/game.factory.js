angular.module('ProtocolApp')
.factory('game',['club', game]);
function game (club) {

    club.defaultPlayer = {
        nick: ' ',
        falls: 0,
        role: club.ROLES[0],
        BP: false,
        BR: false
    };

    var playerLines = [];
    for (var i = 0; i < club.PLAYER_NUMBER; i++) {
        playerLines.push(angular.copy(club.defaultPlayer));
    }


    club.defaultVote = {
        who: '',
        whom: '',
        sum: 0
    };

    club.defaultDay = {
        votes:[angular.copy(club.defaultVote)],
        results: {
            hanged: '',
            killed: '',
            checkedS: '',
            checkedD: '',
        }
    };

    club.defaultMetadata = {
        table: club.TABLES[0],
        win: club.WIN[0],
        date: new Date(),
        ref: 'Merlin',
        gameNumber: 1,
    };

    club.defaultGame = {
        playerLines: playerLines,
        metadata: club.defaultMetadata,
        days: [club.defaultDay]
    };

    return angular.copy(club.defaultGame);
}
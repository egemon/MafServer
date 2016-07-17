var pgApi = require('./myPgApi.js');
var db = require('../dataBase.js');
var LGS = require('../../model/LocalGameStorage.js');

function migratePlayers() {
    var players = db.getPlayers();
    players = players.map(function(player) {
        var newPlayer = {};
        console.log('player', player);

        newPlayer.nick = player.nick || '';
        newPlayer.phone = player.phone || '';
        newPlayer.faculty = player.faculty || '';
        newPlayer.presents = JSON.stringify(player.presents) || '';

        newPlayer.memberlevel = +player.memberLevel || 0;
        newPlayer.firstname = player.name && player.name.split(' ')[0] || '' || player.nick;
        newPlayer.lastname = player.name && player.name.split(' ')[1] || '' || player.nick;
        newPlayer.email = '';
        newPlayer.vklink = player.vk && player.vk.replace('https://vk.com/', '') || '';
        newPlayer.fblink = '';
        newPlayer.birthdate = player.birthday || 'NULL';
        newPlayer.startdate = player.experiance && player.experiance.split(' ')[3] || 'NULL';
        newPlayer.imglink = '';

        if (newPlayer.birthdate === 'NULL') {
            delete newPlayer.birthdate;
        }

        if (newPlayer.startdate === 'NULL') {
            delete newPlayer.startdate;
        }

        return newPlayer;

        // return {
        //  nick,
        //  memberlevel,
        //  firstname,
        //  lastname,
        //  email,
        //  vklink,
        //  fblink,
        //  phone,
        //  faculty,
        //  birthdate,
        //  presents,
        //  notes,
        //  startdate
        // }
    });

    pgApi.addRecords('players', players);
}

function migrateGames() {
    var games = LGS.getAllGames();
    var gameLines = [];

    games.forEach(function(game) {
        var metadata = game.metadata;

        game.playerLines.forEach(function (player, i) {
            console.log('player', player);

            gameLines.push({
                date: metadata.date,
                board: metadata.table,
                gamenumber: metadata.gameNumber,
                referee: metadata.ref,
                playernumber: i + 1,
                nick: player.nick,
                role: player.role,
                win: metadata.win,
                bp: player.BP ? 1 : 0,
                br: player.BR ? 1 : 0,
                falls: 0,
            });
        });
    });



 // id
 // date
 // board
 // gamenumber
 // referee
 // playernumber
 // nick
 // role
 // win
 // bp
 // br
 // falls
 // notes


    pgApi.addRecords('games', gameLines);
}
// migrateGames();


function migrateNews() {
    var news = db.getNews();
    news = news.map(function (item) {
        var type = item.type;
        delete item.type;
        var img = item.img;
        delete item.img;
        return {
            imglink: img || '',
            type: type,
            data: JSON.stringify(item),
        };
    });


    // // id
    // // imglink
    // // type
    // date
    // data
    // notes

    pgApi.addRecords('news', news);
}
migrateNews();



// TODO: additinoaly calculated should be:
// title, priority,
// TODO: additinaly joined shuld be
// player startdate, faculty, all honours,
// imgLink, vk
function migrateHonours() {
    var periods = db.getHallOfFame();
    var honours = [];
    periods.forEach(function (period) {
        period.forEach(function (honour) {
            honours.push({
                nick: honour.nick,
                year: period.year,
                periodtype: period.periodtype,
                period: period.period,
                place: honour.place,
            });
        });
    });




 // pgApi.addRecords('honours', honours);
 // id,
 // nick,
 // year,
 // periodtype,
 // period,
 // score,
 // place,
 // notes

}

migrateHonours();
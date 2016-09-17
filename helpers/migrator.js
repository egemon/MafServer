var pgApi = require('./myPgApi.js');

function migratePlayers(tableName, players, ids) {
    players = players.map(function(player) {
        var newPlayer = {};

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
    if (ids) {
    return pgApi.update(tableName, players, ids);
    } else {
    return pgApi.create(tableName, players);
    }
}


function migrateGames(tableName, games, ids) {
    var gameLines = [];

    games.forEach(function(game) {
        var metadata = game.metadata;

        game.playerLines.forEach(function (player, i) {

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
                gameid: metadata.date + '_' + metadata.gameNumber + '_' + metadata.table
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

 if (ids) {
    return pgApi.update(tableName, gameLines, ids);
 } else {
    return pgApi.create(tableName, gameLines);
 }
}

function gameSQLtoJSON(gameLines) {
    return {
        metadata: {
            date: gameLines[0].date,
            table: gameLines[0].board,
            gameNumber: gameLines[0].gamenumber,
            ref: gameLines[0].referee,
            win: gameLines[0].win,
        },
        playerLines: gameLines
        .sort(function (a, b) {
            return a.playernumber < b.playernumber ? -1 : 1;
        }).map(function(gameLine) {
            return {
                nick: gameLine.nick ,
                role: gameLine.role ,
                BP: gameLine.bp  ? true : false,
                BR: gameLine.br  ? true : false,
                falls: gameLine.falls,
            };
        })
    };

}


function migrateNews(tableName, news, ids) {
    news = news.map(function (item) {
        // var type = item.type;
        // delete item.type;
        // var img = item.img;
        // delete item.img;
        // var el = {
        //     imglink: img || '',
        //     type: type,
        //     data: JSON.stringify(item),
        // };
        // _.extend(el, item);
        item.place = item.where;
        delete item.where;
        item.date = item.when;
        delete item.when;
        item.description = item.what;
        delete item.what;


        return item;
    });


    // // id
    // // imglink
    // // type
    // date
    // data
    // notes
    if (ids) {
    return pgApi.update(tableName, news, ids);
    } else {
    return pgApi.create(tableName, news);
    }
}



// TODO: additinoaly calculated should be:
// title, priority,
// TODO: additinaly joined shuld be
// player startdate, faculty, all honours,
// imgLink, vk
function migrateHonours(tableName, periods, ids) {
    var honours = [];
    periods.forEach(function (period) {
        period.honours.forEach(function (honour) {
            honours.push({
                nick: honour.nick,
                year: period.year,
                periodtype: period.periodType,
                period: period.period,
                place: honour.place,
            });
        });
    });



    if (ids) {
 return pgApi.update(tableName, honours, ids);
    } else {
 return pgApi.create(tableName, honours);
    }
 // id,
 // nick,
 // year,
 // periodtype,
 // period,
 // score,
 // place,
 // notes

}

function migratePhotos(tableName, photos, ids) {
    if (ids) {
 return pgApi.update(tableName, photos, ids);
    } else {
 return pgApi.create(tableName, photos);
    }
 // id,
 // nick,
 // year,
 // periodtype,
 // period,
 // score,
 // place,
 // notes

}


module.exports = {
    migratePlayers,
    migrateGames,
    migrateNews,
    migrateHonours,
    gameSQLtoJSON
};
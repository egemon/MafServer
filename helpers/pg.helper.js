var QRunner = require('./connection.js');
var pgApi = require('./myPgApi.js');
var moment = require('moment');
// filterObject = {
//     id: "2015-09-21_1_Baker Street",
//     periodType: "month" || "year" || "season",
//     period: "1" || "2015" || "4",
//     playerNick: "Merlin"
// }

function getRatingByFilter(table, filterObject) {
    "use strict";

    let query = new QRunner(`
    select ${table}.nick,
    round(
        avg(case
             when ${table}.role='Мирный' and ${table}.win='Мирные' then 3
             when ${table}.role='Мирный' and ${table}.win='Мафия' then 0
             when ${table}.role='Мафия' and ${table}.win='Мирные' then 0
             when ${table}.role='Мафия' and ${table}.win='Мафия' then 4
             when ${table}.role='Шериф' and ${table}.win='Мирные' then 4
             when ${table}.role='Шериф' and ${table}.win='Мафия' then -1
             when ${table}.role='Дон' and ${table}.win='Мирные' then -1
             when ${table}.role='Дон' and ${table}.win='Мафия' then 5
        end + ${table}.bp),
    2) as score, count(${table}.bp) as gameNumber, sum(${table}.bp) as bp, sum(${table}.br) as br, players.imglink
    from ${table}
    left join players on games.nick = players.nick
    ${_transformFilterObjToWhere(filterObject, table)}
    GROUP BY GROUPING SETS ((${table}.nick, players.imglink))
    order by score desc
    `);

    return query.execQuery().then(function (resp) {
        return resp.rows;
    });
}

function getGamesByFilter(table, filterObject) {
    "use strict";
    let query = new QRunner(`
    select date, board, gamenumber, referee, playernumber, nick, role, win, bp, br from ${table}
    ${_transformFilterObjToWhere(filterObject, table)}
    order by date, board, gamenumber, playernumber asc
    `);

    return query.execQuery().then(function (resp) {
        return resp.rows;
    });
}

function getAll(table, sorting) {
    "use strict";
    sorting = sorting || 'asc';
    let query = new QRunner(`
    select * from ${table}
    order by date ${sorting}
    `);

    return query.execQuery().then(function (resp) {
        return resp.rows;
    });
}


function _transformFilterObjToWhere(filterObj, table) {
    "use strict";
    var m = moment();
    var start;
    var end;
    switch(filterObj.periodType) {
        case 'month':
            start = m.set('month', filterObj.period - 1).startOf('month').format('YYYY-MM-DD');
            end = m.endOf('month').format('YYYY-MM-DD');
            break;
        case 'season':
            let periodStart = (filterObj.period - 1)*3 - 1;
            start = m.set('month', periodStart).startOf('month').format('YYYY-MM-DD');
            end = m.add(2, 'month').endOf('month').format('YYYY-MM-DD');
            break;
        case 'year':
            start = m.set('year', filterObj.year).startOf('year').format('YYYY-MM-DD');
            end = m.endOf('year').format('YYYY-MM-DD');
            console.log('start-end', start, end);
            break;
    }
    return `where '${start}' <= ${table}.date and ${table}.date <='${end}'`;
}

function authentificate (user) {
    return pgApi.read('players', {nick: " = '" + user.nick + "'"})
        .then(function (resp) {
        console.log('pg.helper.js authentificate', resp);
        return {
            result: resp.data[0].password === user.password,
            player: resp.data[0]
        }
    })
}

// getGamesByFilter('games', {
//     periodType: 'year',
//     period: 2016,
// }).then(function (data) {
//     console.log('data', data);
// }, function (err) {
//     console.log('err', err);
// });

module.exports = {
    getRatingByFilter,
    getGamesByFilter,
    getAll,
    authentificate
};
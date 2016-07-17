var QRunner = require('./connection.js');
var moment = require('moment');
// filterObject = {
//     id: "2015-09-21_1_Baker Street",
//     periodType: "month" || "year" || "season",
//     period: "1" || "2015" || "4",
//     playerNick: "Merlin"
// }

function getGamesByFilter(table, filterObject) {
    "use strict";
    var m = moment();
    var start;
    var end;
    switch(filterObject.periodType) {
        case 'month':
            start = m.set('month', filterObject.period - 1).startOf('month').format('YYYY-MM-DD');
            end = m.endOf('month').format('YYYY-MM-DD');


            break;
        case 'season':
            let periodStart = (filterObject.period - 1)*3 - 1;
            start = m.set('month', periodStart).startOf('month').format('YYYY-MM-DD');
            end = m.add(2, 'month').endOf('month').format('YYYY-MM-DD');
            break;
        case 'year':
            start = m.set('year', filterObject.period).startOf('year').format('YYYY-MM-DD');
            end = m.endOf('year').format('YYYY-MM-DD');
            console.log('start-end', start, end);
            break;
    }

    let query = new QRunner(`
    select nick,
    round(
        avg(case
             when role='Мирный' and win='Мирные' then 3
             when role='Мирный' and win='Мафия' then 0
             when role='Мафия' and win='Мирные' then 0
             when role='Мафия' and win='Мафия' then 4
             when role='Шериф' and win='Мирные' then 4
             when role='Шериф' and win='Мафия' then -1
             when role='Дон' and win='Мирные' then -1
             when role='Дон' and win='Мафия' then 5
        end + bp),
    2) as score, count(bp) as gameNumber, sum(bp) as bp, sum(br) as br
    from ${table}
    where '${start}' <= date and date <='${end}'
    GROUP BY GROUPING SETS ((nick))
    order by score desc
    `);

    return query.execQuery().then(function (resp) {
        return resp.rows;
    });
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
    getGamesByFilter
};
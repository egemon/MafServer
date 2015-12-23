var honourTitle = "Лучшие игроки";
var MONTHS = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
var SEASONS = ["","ЗИМЫ", 'ВЕСНЫ', "ЛЕТА", "ОСЕНИ"]


function createPeriodsOfFame (players) {
    var honours = createHonours(players);
    var periods = createPeriods(honours);
    return periods.sort(byPeriod);
}

function createHonours (players) {
    var player = {};
    var honour = {};
    var honours = [];
    for (var i = 0; i < players.length; i++) {
        player = players[i];
        for (var j = 0; j < player.honours.length; j++) {
            honour = player.honours[j];
            honours.push({
                nick: player.nick,
                year: honour.year,
                period: honour.period,
                periodType: honour.periodType,
                place: honour.place,
                avr: honour.avr,
                gameNumber: honour.gameNumber,
                faculty: player.faculty,
                experiance: player.experiance,
                honours: player.honours || []
                //other stuffn
            });
        };
    };
    return honours;
}

function createPeriods (honours) {
    var periods = {};
    var periodTitle = "";
    var period = {};
    var honour = {};
    for (var i = 0; i < honours.length; i++) {
        honour = honours[i];
        periodTitle = createPeriodTitle(honours[i]); 
        period = periods[periodTitle];
        if (!period) {
            period = periods[periodTitle] = {
                honours: [],
                year: honour.year,
                periodType: honour.periodType,
                period: honour.period,
                priority: getPeriodPriority(honour.periodType, honour.period)
            };
        }
        period.honours[honour.place - 1] = honour;
    };
    var periodsArray = [];
    for (var title in periods) {
        periods[title].title = title;
        periodsArray.push(periods[title]);
    };
    return periodsArray;
}

function createPeriodTitle (honour) {
    switch (honour.periodType) {
        case "year":
            return honourTitle + ' ' + honour.period + '-го года'
        case "season":
            return honourTitle + ' ' + SEASONS[honour.period]
        case "month":
            return honourTitle + ' ' + MONTHS[honour.period]
    }
}

function byPeriod (period1, period2) {
    return (period1.year - period2.year) ||
        (period1.periodType === "year") || 
        (period1.priority - period2.priority)
}

function getPeriodPriority (periodType, period) {
    return periodType === "season" ? period * 3 - 1 / 2 : period ;
}

module.exports = {
    createFrom: createPeriodsOfFame
};
var honourTitle = "Лучшие игроки";
var MONTHS = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
var SEASONS = ["","ЗИМЫ", 'ВЕСНЫ', "ЛЕТА", "ОСЕНИ"]

var express = require('express');
var fs = require('fs');
var router = express.Router();
var LocalGameStorage = require('../model/LocalGameStorage');
var photos = require('../data-base/photos.json');
var players = require('../data-base/players/players.json');
var meetingDefaults = require('../data-base/news/defaults.json');


// ============ HELPERS ==============
function isMember(player) {
    return player.memberLevel > 0;
}
function isOrg (player) {
    return player.memberLevel > 2;
}

function byOrgLevel (player1, player2 ) {
    return player1.honours.length > player2.honours.length;
}

function byHonourLevel (player1, player2) {
    return player1.memberLevel > player2.memberLevel;
}

// ==============  FOR hall_of_famЫe =================
function createPeriodsOfFame (players) {
    var honours = createHonours(players);
    console.log('honours = ', honours);
    var periods = createPeriods(honours);
    console.log('periods = ', periods);
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


var meetingData = meetingDefaults;
meetingData.when = '2015-12-22T17:00';
meetingData.number = 163;
meetingData.postDate = '2015-12-16';
var PAGES = [{
        page: 'home',
        rus: 'О нас'
    },{
        page: 'news',
        rus: 'Новости',
        data: meetingData
    },{
    //     page: 'rating',
    //     rus: 'Рейтинг'
    // },{
        page: 'members',
        rus: 'Члены клуба',
        players: players.filter(isMember).sort(byHonourLevel)
    },{
        page: 'hall_of_fame',
        rus: 'Зал Славы',
        periods: createPeriodsOfFame(players)
    },{
        page: 'photos',
        rus: 'Фото',
        photos: photos
    },{
        page: 'contacts',
        rus: 'Контакты',
        contacts: players.filter(isOrg)
    }];

// ================ handlers for get PAGES ================ //
for (var i = 0; i < PAGES.length; i++) {
    (function(PAGES, i){
            console.log(PAGES[i]);
            router.get('/' + PAGES[i].page, function(req, res) {
                console.log('[ROUTER] get for' + PAGES[i], req.url);
                res.render(PAGES[i].page + '.ejs', {current: i, pages: PAGES});
            });
        })(PAGES, i);
}

router.get('/', function(req, res) {
    console.log('[ROUTER] get for', req.url);
    res.render('home.ejs', {current: 0, pages: PAGES});
});


// ================ handlers for MafTable ================ //

//getGamesByFilter
router.get('/sync', function (req, res) {
    console.log('sync get request taken!');
    var filterObject = req.query.filterObject;
    console.log('req.data = ', filterObject);

    var games = JSON.stringify(LocalGameStorage.getGamesByFilter(JSON.parse(filterObject)));
    console.log('games = ', games);
    res.send(games);
});

//getGamesByFilter
router.post('/sync', function (req, res) {
    console.log('psync post request taken!');
    console.log('req.data = ', req.body.games);
    var result = "";
    if (LocalGameStorage.saveGameArray(JSON.parse(req.body.games))) {
        result = 'Game Saved!';
    } else {
        result = 'There is no games!';
    }
    res.send(result);
});



module.exports = router;
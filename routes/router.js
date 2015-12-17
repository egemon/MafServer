var express = require('express');
var fs = require('fs');
var router = express.Router();
var LocalGameStorage = require('../model/LocalGameStorage');
var photos = require('../data-base/photos.json');
var contacts = require('../data-base/contacts.json');
var periodsOfFame = require('../data-base/hall_of_fame/hall_of_fame.json');
var players = require('../data-base/players/players.json');
var meetingDefaults = require('../data-base/news/defaults.json');
var famePlayers = periodsOfFame.players;

periodsOfFame = sortFamePlayers(famePlayers);


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

function sortFamePlayers (players) {
    for (var i = 0; i < players.length; i++) {

    }
}

function derivePlayersByPeriodType (players) {
    var result = {
        year: [],
        season: [],
        month: []
    };
    for (var i = 0; i < players.length; i++) {

    }
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
        periods: periodsOfFame
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
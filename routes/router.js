var express = require('express');
var fs = require('fs');
var router = express.Router();

var LocalGameStorage = require('../model/LocalGameStorage');
var RatingBase = require('../model/RatingBase');

var photos = require('../data-base/photos.json');
var players = require('../data-base/players/players.json');
var meetings = require('../data-base/news/meetings.json');

var periodHelper = require('../helpers/famePeriods');
var playerHelper = require('../helpers/players');
var meetingHelper = require('../helpers/meetings');

var rating = RatingBase.calculateRating(LocalGameStorage.getGamesByFilter({
    periodType: "month",
    period: 9
}));

console.log('rating = ', rating);

function getPlayersFromBase (ratingObject) {
    var playerArray = [];
    var player = {};
    for (var i = 0; i < ratingObject.length; i++) {
        player = playerHelper.getPlayerByNick(players, ratingObject[i].name) || {};
        player.avr = ratingObject[i].sum / ratingObject[i].gameNumber;
        player.gameNumber = ratingObject[i].gameNumber;
        playerArray.push(player);
    }
    return playerArray;
}
var rating = getPlayersFromBase(rating);
console.log('rating = ', rating);
var PAGES = [{
        page: 'home',
        rus: 'О нас'
    },{
        page: 'news',
        rus: 'Новости',
        news: meetingHelper.getMeetings(meetings)
    },{
        page: 'rating',
        rus: 'Рейтинг',
        players: rating
    },{
        page: 'members',
        rus: 'Члены клуба',
        players:  playerHelper.getMembers(players)
    },{
        page: 'hall_of_fame',
        rus: 'Зал Славы',
        periods: periodHelper.createFrom(players)
    },{
        page: 'photos',
        rus: 'Фото',
        photos: photos
    },{
        page: 'contacts',
        rus: 'Контакты',
        contacts: playerHelper.getOrgs(players)
    }];
// ================ handlers for get PAGES ================ //
for (var i = 0; i < PAGES.length; i++) {
    (function(PAGES, i){
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
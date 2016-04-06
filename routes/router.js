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
    console.log('ROUTER getPlayersFromBase() ratingObject', ratingObject);
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
// var rating = getPlayersFromBase(rating);
// console.log('rating = ', rating);
var PAGES = [{
        url: 'home',
        rus: 'О нас'
    },{
        url: 'news',
        rus: 'Новости',
        news: meetingHelper.getMeetings(meetings)
    },{
        url: 'rating',
        rus: 'Рейтинг',
        players: rating
    },{
        url: 'members',
        rus: 'Члены клуба',
        players:  playerHelper.getMembers(players)
    },{
        url: 'hall_of_fame',
        rus: 'Зал Славы',
        periods: periodHelper.createFrom(players)
    },{
        url: 'photos',
        rus: 'Фото',
        photos: photos
    },{
        url: 'contacts',
        rus: 'Контакты',
        contacts: playerHelper.getOrgs(players)
    },{
        url: 'protocols',
        rus: 'Бланки',
        data: 'Smth protocols'
    },{
        url: 'admin',
        rus: 'База',
        data: 'Smth admin'
    }];
// ================ handlers for get PAGES ================ //
for (var i = 0; i < PAGES.length; i++) {
    (function(PAGES, i){
        var page = PAGES[i];

        // old API
        // router.get('/' + page.url, function(req, res) {
        //     console.log('[ROUTER] get for' + page, req.url);
        //     res.render(page.url + '.ejs', {current: i, pages: PAGES});
        // });

        // new API
        router.post('/' + page.url, function(req, res) {
            console.log('[ROUTER] post for' + page, req.url);
            for (var key in page) {
                if (key === 'url' || key === 'rus') {
                    continue;
                }

            //assume we have only one field with data
            res.send(page[key]);
            }

        });

    })(PAGES, i);
}

// router.get('/', function(req, res) {
//     console.log('[ROUTER] get for', req.url);
//     res.render('home.ejs', {current: 0, pages: PAGES});
// });

router.get('/*', function(req, res) {
    console.log('[ROUTER] get for', req.url);
    res.render('../MafSite/assets/base.html');
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

// ================ handlers for Login ================ //

var maftableUrl = '/maftable';
router.get(maftableUrl, function (req,res) {
    res.render('../MafTable/MafTable.html');
});

router.post('/login', function (req, res) {
    console.log('password = ', req.body);
    console.log('password = ', req.body.password);
    console.log('user = ', req.body.user);

    var user = req.body.user;
    var password = req.body.password;

    var result = authentificate(players, user, password);
    res.send(JSON.stringify(result));

});



function authentificate (players, user, password) {
    player = playerHelper.getPlayerByNick(players, user);
    if (player && player.password === password) {
        return player;
    } else {
        return {
            errorText: 'Вы еще не зарегистрированы или указан неправильный пароль!'
        };
    }
}
module.exports = router;
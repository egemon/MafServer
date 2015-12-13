var express = require('express');
var fs = require('fs');
var router = express.Router();
var LocalGameStorage = require('../model/LocalGameStorage');
var periodsOfFame = require('../data-base/hall_of_fame/hall_of_fame.json');
var players = require('../data-base/players/players.json');

function isMember(player) {
    return player.memberLevel > 0;
}
var PAGES = [
    {
        page: 'home',
        rus: 'О нас'
    },
    {
        page: 'news',
        rus: 'Новости'
    },{
        page: 'rating',
        rus: 'Рейтинг'
    },{
        page: 'members',
        rus: 'Члены клуба',
        players: players.filter(isMember)
    },{
        page: 'hall_of_fame',
        rus: 'Зал Славы',
        periods: periodsOfFame
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
var express = require('express');
var fs = require('fs');
var router = express.Router();

var PLAYERS_PATH = './data-base/players/players.json';
var LocalGameStorage = require('../model/LocalGameStorage');
var RatingBase = require('../model/RatingBase');

var dataBase = {
    players: require('.' + PLAYERS_PATH),
    photos: require('../data-base/photos.json'),
    meetings: require('../data-base/news/meetings.json')
};
refreshPlayerInfo();

fs.watch(PLAYERS_PATH, refreshPlayerInfo);

var periodHelper = require('../helpers/famePeriods');
var playerHelper = require('../helpers/players');
var meetingHelper = require('../helpers/meetings');

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
        getData: meetingHelper.getMeetings.bind(this, dataBase.meetings)
    },{
        url: 'rating',
        rus: 'Рейтинг',
        getData: function (body) {
            if (!Object.keys(body).length) {
                body = '';
            }
            // filterObject = {
            //     gameId: "MT_2015-09-21_1_Baker Street",
            //     periodType: "month" || "year" || "season",
            //     period: "1" || "2015" || "4",
            //     playerNick: "Merlin"
            // }
            var defaultFilter = {
                    periodType: "month",
                    period: 9,
                    year: 2015
            };

            console.log('[router] getData(rating)', arguments);
            return RatingBase.calculateRating.call(RatingBase, LocalGameStorage.getGamesByFilter(body || defaultFilter));
        }
    },{
        url: 'members',
        rus: 'Члены клуба',
        getData:  playerHelper.getMembers.bind(this, dataBase.players)
    },{
        url: 'hall_of_fame',
        rus: 'Зал Славы',
        getData: periodHelper.createFrom.bind(this, dataBase.players)
    },{
        url: 'photos',
        rus: 'Фото',
        getData: function () {
            return dataBase.photos;
        }
    },{
        url: 'contacts',
        rus: 'Контакты',
        getData: playerHelper.getOrgs.bind(this, dataBase.players)
    },{
        url: 'protocols',
        rus: 'Бланки',
        needMemberLevel: 3
    },{
        url: 'players',
        rus: 'Игроки',
        getData:  function () {
            return {
                data: dataBase.players,
                fields: playerHelper.getPlayerFields()
            };
        },
        needMemberLevel: 3
    }];



// ================ handlers for get PAGES ================ //
for (var i = 0; i < PAGES.length; i++) {
    (function(i){

        // old API
        // router.get('/' + page.url, function(req, res) {
        //     console.log('[ROUTER] get for' + page, req.url);
        //     res.render(page.url + '.ejs', {current: i, pages: PAGES});
        // });

        // new API
        router.post('/' + PAGES[i].url, function(req, res) {
            console.log('[ROUTER] post for', req.url);

            if (PAGES[i].needMemberLevel) {

                var player = authentificate(dataBase.players, req.body.credentials);
                if (player.memberLevel >= PAGES[i].needMemberLevel) {
                    res.send(PAGES[i].getData(req.body));
                } else {
                    res.send(JSON.stringify({
                       errorText: 'Эта страничка доступна только для администраторов!'
                    }));
                }
            } else {
                res.send(PAGES[i].getData(req.body));
            }
        });
    })(i);
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

//saveGamesByFilter
router.post('/sync', function (req, res) {
    console.log('psync post request taken!');
    console.log('req.data = ', req.body.games);
    var result = "";
    if (LocalGameStorage.saveGameArray(req.body.games)) {
        result = 'Game Saved!';
    } else {
        result = 'There is no games!';
    }
    res.send(result);
});

// ================ handlers for Login ================ //

router.post('/login', function (req, res) {
    console.log('password = ', req.body.credentials.password);
    console.log('user = ', req.body.credentials.user);

    var player = authentificate(dataBase.players, req.body.credentials);

    if (player) {
        res.send(JSON.stringify(player));
    } else {
        res.send(JSON.stringify({
            errorText: 'Вы еще не зарегистрированы или указан неправильный пароль!'
        }));
    }
});

// ================ handler for changing DB
router.post('/setplayers', function(req, res) {
    console.log('[router] /setplayers ');
    var player = authentificate(dataBase.players, req.body.credentials);
    if (player) {
        fs.writeFile(PLAYERS_PATH, JSON.stringify(req.body.players, null, 4), 'utf8', function function_name(err) {
            if (err) {
                res.send({errorText: err});
            } else {
                res.send({succesText: 'Игры сохранены!'});
            }
        });
    } else {
        res.send(JSON.stringify({
            errorText: 'Недостаточно прав для этого действия!'
        }));
    }
});

function refreshPlayerInfo () {
    console.log('[router] refreshPlayerInfo()', arguments);

    fs.readFile(PLAYERS_PATH, function (err, data) {
        if (err) {
            console.log('Error!!! ', err);
        } else {
            console.log('data = ', data);
            try {
                JSON.parse(data);
                dataBase.players = JSON.parse(data);
            } catch(e){
                console.error('[router] refreshPlayerInfo readFile error', e);
            }

        }
    });
}


function authentificate (players, credentials) {
    var password = credentials.password;
    var user = credentials.user;
    console.log('[router] authentificate() password, user = ', password, user);
    player = playerHelper.getPlayerByNick(players, user);
    console.log('[router] authentificate() player = ', player);
    if (player && player.password === password) {
        return player;
    } else {
        return false;
    }
}
module.exports = router;
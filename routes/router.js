var express = require('express');
var router = express.Router();

var LocalGameStorage = require('../model/LocalGameStorage');
var RatingBase = require('../model/RatingBase');
var dataBase = require('../helpers/dataBase.js');

dataBase.refreshInfoFor('all');
dataBase.initializeWatching('all');
dataBase.watchLocalStorage();

var today = new Date();
var PAGES = [{
        url: 'home',
    },{
        url: 'news',
        getData: function () {
            return dataBase.getNews();
        }
    },{
        url: 'rating',
        getData: function (body) {
            console.log('[router] getData(rating)', arguments);
            if (!Object.keys(body).length) {
                body = '';
            }
            var defaultFilter = {
                periodType: "month",
                period: +today.toISOString().split('T')[0].split('-')[1],
                year: today.getUTCFullYear()
            };

            return RatingBase.calculateRating.call(RatingBase,
                LocalGameStorage.getGamesByFilter(body || defaultFilter));
        }
    },{
        url: 'members',
        getData:  function () {
            return dataBase.getMembers();
        }
    },{
        url: 'hall_of_fame',
        getData: function () {
            return dataBase.getHallOfFame();
        }
    },{
        url: 'photos',
        getData: function () {
            return dataBase.getPhotos();
        }
    },{
        url: 'contacts',
        getData: function () {
            return dataBase.getOrgs();
        }

    },{
        url: 'protocols',
        needMemberLevel: 3
    },{
        url: 'players',
        getData:  function () {
            return {
                data: dataBase.getPlayers(),
                fields: dataBase.getPlayerFields()
            };
        },
        needMemberLevel: 3
    },{
        url: 'contents',
        getData:  function () {
            return {
                data: dataBase.getNews(),
                fields: dataBase.getMeetingFields()
            };
        },
        needMemberLevel: 3
    },{
        url: 'register',
        getData:  function (request) {
            console.log('[router.js] getRegister() ', arguments);
            var date = request.date;
            if (!date) {
                date = new Date().toISOString().split('T')[0];
            }
            return {
                data: dataBase.getRegister(date),
                fields: dataBase.getRegisterFields()
            };
        },
        needMemberLevel: 3
    }];



// ================ handlers for get PAGES ================ //
for (var i = 0; i < PAGES.length; i++) {
    (function(i){

        router.post('/' + PAGES[i].url, function(req, res) {
            console.log('[ROUTER] post for', req.url);

            if (PAGES[i].needMemberLevel) {
                console.log('req.cookies[player-data]', JSON.parse(req.cookies['player-data']));
                var player = dataBase.authentificate(JSON.parse(req.cookies['player-data']));
                if (player.memberLevel >= PAGES[i].needMemberLevel) {
                    console.log('[router.js] body = ', req.body);
                    res.send(PAGES[i].getData(req.body));
                } else {
                    res.send(JSON.stringify({
                       errorText: 'Эта страничка доступна только для администраторов!'
                    }));
                }
            } else {
                console.log('[router.js] body = ', req.body);
                res.send(PAGES[i].getData(req.body));
            }
        });
    })(i);
}


// ==================== BASE for ANGULAR ==============
router.get('/*', function(req, res) {
    console.log('[ROUTER] get for', req.url);
    res.render('../MafSite/assets/base.html');
});


// ================ handlers for MafTable ================ //

//getGamesByFilter
router.post('/delete', function (req, res) {
    console.log('sync delete request taken!');
    console.log('[router] getGames / delete', req.body);
    LocalGameStorage.deleteGame(
        LocalGameStorage.generateGameId(req.body)
    ).when(function(isDeleted){
        if (isDeleted) {
            res.send({
                errorText: 'Игра удалена!'
            });
        } else {
            res.send({
                errorText: 'Игра не найдена!'
            });
        }
    });
});

//getGamesByFilter
router.post('/load', function (req, res) {
    console.log('sync get request taken!');
    console.log('[router] getGames / load', req.body);
    var games = LocalGameStorage.getGamesByFilter({
        gameId: LocalGameStorage.generateGameId(req.body)
    });
    console.log('[router] getGames /load games = ', games);
    if (games) {
        res.send(games);
    } else {
        res.send({
            errorText: 'Игра не найдена!'
        });
    }
});

//saveGamesByFilter
router.post('/sync', function (req, res) {
    console.log('psync post request taken!');
    console.log('req.data = ', req.body.games);
    var result = "";
    if (LocalGameStorage.saveGameArray(req.body.games)) {
        result = 'Игра сохарнена!';
    } else {
        result = 'Проблемы с сервером. Сообщите администратору!';
    }
    res.send({errorText: result});
});

// ================ handlers for Login ================ //

router.post('/login', function (req, res) {
    console.log('password = ', JSON.parse(req.cookies['player-data']).password);
    console.log('user = ', JSON.parse(req.cookies['player-data']).user);
    console.log('user = ', JSON.parse(req.cookies['player-data']));

    var player = dataBase.authentificate(JSON.parse(req.cookies['player-data']));

    if (player) {
        res.send(JSON.stringify(player));
    } else {
        res.send(JSON.stringify({
            errorText: 'Вы еще не зарегистрированы или указан неправильный пароль!'
        }));
    }
});

router.post('/set', function(req, res) {
    console.log('[router] /set ');
    var player = dataBase.authentificate(JSON.parse(req.cookies['player-data']));
    if (player.memberLevel >= 3) {
        dataBase.setData(req.body.data, req.body.field, req.body.path);
        res.send(JSON.stringify({
            successText: 'Данные по регистрации сохарнены!'
        }));
    } else {
        res.send(JSON.stringify({
            errorText: 'Недостаточно прав для этого действия!'
        }));
    }
});

module.exports = router;
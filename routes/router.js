var express = require('express');
var router = express.Router();

var LocalGameStorage = require('../model/LocalGameStorage');
var RatingBase = require('../model/RatingBase');
var dataBase = require('../helpers/dataBase.js');

dataBase.refreshInfoFor('all');
dataBase.initializeWatching('all');

var today = new Date();
var PAGES = [{
        url: 'home',
        rus: 'О нас'
    },{
        url: 'news',
        rus: 'Новости',
        getData: function () {
            return dataBase.getNews();
        }
    },{
        url: 'rating',
        rus: 'Рейтинг',
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
        rus: 'Члены клуба',
        getData:  function () {
            return dataBase.getMembers();
        }
    },{
        url: 'hall_of_fame',
        rus: 'Зал Славы',
        getData: function () {
            return dataBase.getHallOfFame();
        }
    },{
        url: 'photos',
        rus: 'Фото',
        getData: function () {
            return dataBase.getPhotos();
        }
    },{
        url: 'contacts',
        rus: 'Контакты',
        getData: function () {
            return dataBase.getOrgs();
        }

    },{
        url: 'protocols',
        rus: 'Бланки',
        needMemberLevel: 3
    },{
        url: 'players',
        rus: 'Игроки',
        getData:  function () {
            return {
                data: dataBase.getPlayers(),
                fields: dataBase.getPlayerFields()
            };
        },
        needMemberLevel: 3
    },{
        url: 'contents',
        rus: 'Контент',
        getData:  function () {
            return {
                data: dataBase.getNews(),
                fields: dataBase.getMeetingFields()
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


// ==================== BASE for ANGULAR ==============
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
    var promise = null;
    if (player) {
        promise = dataBase.setData(req.body.data, req.body.field);
        promise.when(res.send.bind(res));
    } else {
        res.send(JSON.stringify({
            errorText: 'Недостаточно прав для этого действия!'
        }));
    }

});

module.exports = router;
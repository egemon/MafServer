var isDev = process.env.NODE_ENV !== 'production';
console.log('isDev = ', isDev);

var express = require('express');
var router = express.Router();
var _ = require('lodash');

//TODO: move out handleImages, addImgSrc metod from DataBase helper
var imageHelper = require('../helpers/imageHelper.js');
var pgApi = require('../helpers/myPgApi.js');
var pgHelper = require('../helpers/pg.helper.js');
var migrator = require('../helpers/migrator');
var moment = require('moment');

// ==================== BASE for ANGULAR ==============
router.get('/', function(req, res) {
    console.log('[ROUTER] get for', req.url);
    res.render(isDev ? 'dev.html' : 'app.html');
});

// ================ handlers for games ================ //
//getGamesByFilter
router.post('/delete', function (req, res) {
    console.log('sync delete request taken!');
    console.log('[router] getGames / delete', req.body);
    var metadata = req.body.metadata;
    var force = req.body.force;
    var successText = 'Игра удалена!';
    var errorText = 'Игра не удалена!';
    var confirmText = 'Вы действительно хотите удалиь игру?';

    pgApi.read('games', {
        gameid: " = '" + metadata.date + '_' + metadata.gameNumber + '_' + metadata.table + "'"
    })
    .then(function (data) {
        data = data.data;
        if (data.length && !force) {
            res.send({
                confirmText: confirmText
            });
        } else {
            pgApi.delete('games', data.map(el => el.id)).then(function (data) {
                console.log('data', data);
                res.send({
                    errorText: successText
                });
            }, function (err) {
                console.log('err', err);
                res.send({
                    errorText: errorText
                });
            });
        }
    });

});

//getGamesByFilter
router.post('/load', function (req, res) {
    var metadata = req.body;
    console.log('[router] getGames / load', metadata);
    pgApi.read('games', {
        gameid: " = '" + metadata.date + '_' + metadata.gameNumber + '_' + metadata.table + "'"
    })
    .then(function (data) {
        data = data.data;

        console.log('[router] getGames / load data.length', data.length);
        if (data.length) {
            var game = migrator.gameSQLtoJSON(data);
            console.log('[router] getGames / load game', game);
            res.send(game);
        } else {
            res.send({
                errorText: 'Игра не найдена!'
            });
        }
    });
});

//saveGamesByFilter
router.post('/sync', function (req, res) {
    console.log('psync post request taken!');
    var force = req.body.force;
    var ids = req.body.ids;
    var game = req.body.game;
    var metadata = game.metadata;
    var successText = 'Игра сохарнена!';
    var errorText = 'Игра не сохарнена!';
    var confirmText = 'Игра существует. Вы действительно хотите перезатереть игру?';
    pgApi.read('games', {
        // value: '2016-02-29_1_BakerStreet'
        gameid: " = '" + metadata.date + '_' + metadata.gameNumber + '_' + metadata.table + "'"
    })
    .then(function (data) {
        data = data.data;
        console.log('saveGame() if exist data', data, force);
        if (data.length && !force) {
            res.send({
                confirmText: confirmText,
                ids: data.map(game => game.id)
            });
        } else {
            migrator.migrateGames('games', [game], ids)
            .then(function (data) {
                result = successText;
                res.send({errorText: result, ids: data});
            });
        }
    }).catch(function (err) {
        res.status(501).send(JSON.stringify({
            errorText: errorText,
            err: err
        }));
    });
});

// ================ LOGIN  ================ //
router.post('/login', function (req, res) {
    console.log('password = ', JSON.parse(req.cookies['player-data']).password);
    console.log('user = ', JSON.parse(req.cookies['player-data']));

    pgHelper.authentificate(JSON.parse(req.cookies['player-data']))
    .then(function (data) {
        if (data.result) {
            res.send(JSON.stringify(data.player));
        } else {
            res.send(JSON.stringify({
                errorText: 'Вы еще не зарегистрированы или указан неправильный пароль!'
            }));
        }
    });

});

// =============== PG ONLY ====================


// TODO refactor with /:table
router.patch('/data', function (req, res) {
	console.log('patch set', req.body);
	pgApi.update(req.body.table, req.body.items, req.body.ids)
		.then(handleQueryResult.bind(null, res), function (err) {
			res.status(400).send(err);
		});
});

router.delete('/data', function (req, res) {
    console.log('delete set', req.body);
    pgApi.delete(req.body.table, req.body.ids)
    .then(handleQueryResult.bind(null, res), function (err) {
       res.status(400).send(err);
    });

});

router.post('/data', function (req, res) {
    if (req.body.table === 'players') {
        req.body.items = imageHelper.handleImages([req.body.items])[0];
    }

    pgApi.create(req.body.table, req.body.items)
    .then(handleQueryResult.bind(null, res), function (err) {
       res.status(400).send(err);
    });

});

router.get('/data', function (req, res) {
    console.log('req.params', req.query);
    var now = moment();
    var defaultFilter = {
        periodType: "month",
        period: now.get('month') + 1,
        year: now.get('year'),
    };

    try {
        req.query.ids = JSON.parse(req.query.ids);
    } catch(e){}
    req.query.ids = req.query.ids || 'all';
    try {
        req.query.options = JSON.parse(req.query.options);
    } catch(e){}
    if (req.query.table === 'rating') {

        pgHelper.getRatingByFilter('games', req.query.options || defaultFilter).then(function (data) {
           res.send(data);
        });
        return;
    }

    if (req.query.table === 'games') {
        return pgHelper.getGamesByFilter('games', req.query.options || defaultFilter).then(function (data) {
            res.send(data);
        });
    }

    pgApi.read(req.query.table, req.query.ids, req.query.options).then(function (resp) {
        if (resp.success) {

            // TODO: Move imgSRc to database
            if (req.query.table === 'honours') {
                resp.data = _.map(resp.data, function (player) {
                    return imageHelper.addImgSrc('', player);
                });
            }

            res.send(resp);
        }
    }, function (err) {
       res.status(400).send(err);
    });

});
function handleQueryResult(res, dataArray) {
	console.log('dataArray', dataArray);
	result = dataArray[0];
	if (result.success) {
		res.send(result);
	} else {
		res.status(400).send({
			errorText: 'Data wasn"t deleted'
		});
	}
}

module.exports = router;
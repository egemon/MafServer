var isDev = process.env.NODE_ENV ? false : true;
console.log('isDev = ', isDev);

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var LocalGameStorage = require('../model/LocalGameStorage');
var RatingBase = require('../model/RatingBase');
var dataBase = require('../helpers/dataBase.js');
var pgApi = require('../helpers/pg/myPgApi.js');
var migrator = require('../helpers/pg/migrator.js');
var pgHelper = require('../helpers/pg/pg.helper.js');
dataBase.refreshInfoFor('all');
dataBase.initializeWatching('all');
dataBase.watchLocalStorage();

var today = new Date();
var PAGES = [{
        url: 'home',
    },{
        url: 'news',
        getData: function (body) {
            if (body.pg) {
                return pgHelper.getAll('news', 'desc');
            } else {
                return Promise.resolve(dataBase.getNews());

            }

        }
    },{
        url: 'rating',
        getData: function (body) {
            console.log('[router] getData(rating)', arguments);
            if (!body.data) {
                body.data = '';
            }
            var defaultFilter = {
                periodType: "month",
                period: +today.toISOString().split('T')[0].split('-')[1],
                year: today.getUTCFullYear()
            };

            if (body.pg) {
                return pgHelper.getRatingByFilter('games', body.data || defaultFilter);
            } else {
                var games = LocalGameStorage.getGamesByFilter(body.data || defaultFilter);
                return Promise.resolve(RatingBase.calculateRating.call(RatingBase, games));
            }

        }
    },{
        url: 'members',
        getData:  function () {
            return Promise.resolve(dataBase.getMembers());
        }
    },{
        url: 'hall_of_fame',
        getData: function () {
            return Promise.resolve(dataBase.getHallOfFame());
        }
    },{
        url: 'photos',
        getData: function () {
            return Promise.resolve(dataBase.getPhotos());
        }
    },{
        url: 'contacts',
        getData: function () {
            return Promise.resolve(dataBase.getOrgs());
        }

    },{
        url: 'protocols',
        needMemberLevel: 3
    },{
        url: 'players',
        getData:  function () {
            return Promise.resolve( {
                data: dataBase.getPlayers(),
                fields: dataBase.getPlayerFields()
            });
        },
        needMemberLevel: 3
    },{
        url: 'contents',
        getData:  function (body) {

            if (body.pg) {
                return pgHelper.getAll('news', 'desc');
            } else {
                return Promise.resolve({
                    data: dataBase.getNews(),
                    fields: dataBase.getMeetingFields()
                });
            }

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
            return Promise.resolve({
                data: dataBase.getRegister(date),
                fields: dataBase.getRegisterFields()
            });
        },
        needMemberLevel: 3
    },{
        url: 'games',
        getData: function (body) {
            console.log('data', body);

            if (!body.data) {
                body.data = '';
            }

            var defaultFilter = {
                periodType: "month",
                period: +today.toISOString().split('T')[0].split('-')[1],
                year: today.getUTCFullYear()
            };

            return pgHelper.getGamesByFilter('games', body.data || defaultFilter);
        }

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
                    PAGES[i].getData(req.body).then(function (result) {
                        res.send(result);
                    });
                } else {
                    res.send(JSON.stringify({
                       errorText: 'Эта страничка доступна только для администраторов!'
                    }));
                }
            } else {
                console.log('[router.js] body = ', req.body);
                PAGES[i].getData(req.body).then(function (result) {
                    res.send(result);
                });
            }
        });
    })(i);
}


// ==================== BASE for ANGULAR ==============
router.get('/', function(req, res) {
    console.log('[ROUTER] get for', req.url);
    res.render(isDev ? 'dev.html' : 'app.html');
});


// ================ handlers for MafTable ================ //

//getGamesByFilter
router.post('/delete', function (req, res) {
    console.log('sync delete request taken!');
    console.log('[router] getGames / delete', req.body);
    var metadata = req.body.metadata;
    var force = req.body.force;
    var successText = 'Игра удалена!';
    var errorText = 'Игра не удалена!';
    var confirmText = 'Вы действительно хотите удалиь игру?';

    if (req.body.pg) {
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
    } else {
        var gameId = LocalGameStorage.generateGameId(metadata);
        var game = LocalGameStorage.getGamesByFilter({id:gameId});
        if (game && !force) {
            res.send({
                confirmText: confirmText
            });
        } else if(game && force) {
            LocalGameStorage.deleteGame(gameId).when(function(isDeleted){
                if (isDeleted) {
                    res.send({
                        errorText: successText
                    });
                } else {
                    res.send({
                        errorText: errorText
                    });
                }
            });
        } else {
            res.send({
                errorText: errorText
            });
        }
    }






});

//getGamesByFilter
router.post('/load', function (req, res) {
    var metadata = req.body;
    console.log('[router] getGames / load', metadata);

    if (metadata.pg) {
        pgApi.read('games', {
            // key: 'gameid',
            gameid: " = '" + metadata.date + '_' + metadata.gameNumber + '_' + metadata.table + "'"
        })
        .then(function (data) {
            console.log('data',data);
            if (data.data.length) {
                res.send(migrator.gameSQLtoJSON(data.data));
            } else {
                res.send({
                    errorText: 'Игра не найдена!'
                });
            }

        });
    } else {

        var games = LocalGameStorage.getGamesByFilter({
            gameId: LocalGameStorage.generateGameId(metadata)
        });
        console.log('[router] getGames /load games = ', games);
        if (games) {
            res.send(games);
        } else {
            res.send({
                errorText: 'Игра не найдена!'
            });
        }
    }

});

//saveGamesByFilter
router.post('/sync', function (req, res) {
    console.log('psync post request taken!');
    console.log('req.data = ', req.body.game);
    var force = req.body.force;
    var pg = req.body.pg;
    var ids = req.body.ids;
    var game = req.body.game;
    var metadata = game.metadata;
    var successText = 'Игра сохарнена!';
    var errorText = 'Игра не сохарнена!';
    var confirmText = 'Игра существует. Вы действительно хотите перезатереть игру?';
    var isGameExists;
    if (pg) {
        pgApi.read('games', {
            // value: '2016-02-29_1_BakerStreet'
            gameid: " = '" + metadata.date + '_' + metadata.gameNumber + '_' + metadata.table + "'"
        })
        .then(function (data) {
            if (data.length  && !force) {
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
        });

    } else {
        var gameId = LocalGameStorage.generateGameId(metadata);
        isGameExists = LocalGameStorage.getGamesByFilter({id:gameId});


        if (isGameExists && !force) {
            res.send({
                confirmText: confirmText
            });
        } else {
            var result = "";
            if (LocalGameStorage.saveGame(game)) {
                result = successText;
            } else {
                result = errorText;
            }
            res.send({errorText: result});
        }
    }



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
    var field = req.body.field;
    if (player.memberLevel >= 3) {
        if (field === 'contents') {
            field = 'news';
        }


        if (req.body.pg) {
            delete req.body.pg;
            pgApi.update(field, [req.body.data], [req.body.data.id]).then(function (data) {
                console.log('/set Log', data);
                if (data[0].success) {
                   res.send(JSON.stringify({
                        successText: 'Данные сохарнены!'
                    }));
                } else {
                    res.status(403).send(JSON.stringify({
                        errorText: 'Ошибка! Сохарнения не произошло, проверьте данные!'
                    }));
                }
            });
        } else {
            dataBase.setData(req.body.data, req.body.field, req.body.path);
            res.send(JSON.stringify({
                successText: 'Данные сохарнены!'
            }));
        }
    } else {
        res.send(JSON.stringify({
            errorText: 'Недостаточно прав для этого действия!'
        }));
    }
});


// =============== PG ONLY ====================

function handleQueryResult(res, dataArray) {
    console.log('dataArray', dataArray);
    // var result = _.reduce(dataArray, function (prev, cur) {
    //     return {
    //         success: prev.success && cur.success,
    //         data: _.concat(prev.data, cur.data)
    //     };
    // },{
    //     success: 1,
    //     data: []
    // });
    // console.log('result', result);

    result = dataArray[0];
    if (result.success) {
        res.send(result);
    } else {
        res.status(400).send({
            errorText: 'Data wasn"t deleted'
        });
    }
}

// TODO refactor with /:table
router.delete('/data', function (req, res) {
    console.log('delete set', req.body);
    pgApi.delete(req.body.table, req.body.ids)
    .then(handleQueryResult.bind(null, res), function (err) {
       res.status(400).send(err);
    });

});

router.post('/data', function (req, res) {
    pgApi.create(req.body.table, req.body.items)
    .then(handleQueryResult.bind(null, res), function (err) {
       res.status(400).send(err);
    });

});

router.get('/data', function (req, res) {
    console.log('req.params', req.query);
    try {
        req.query.ids = JSON.parse(req.query.ids);
    } catch(e){}
    pgApi.read(req.query.table, req.query.ids)
    .then(function (resp) {
        if (resp.success) {
            if (req.query.table === 'players') {
                resp.data = _.map(resp.data, function (player) {
                    return dataBase.addImgSrc('', player);
                });
            }

            res.send(resp);
        }
    }, function (err) {
       res.status(400).send(err);
    });

});

router.patch('/data', function (req, res) {
    console.log('patch set', req.body);

    if (req.body.table === 'players') {
        req.body.items = dataBase.handleImages([req.body.items])[0];
    }


    pgApi.update(req.body.table, req.body.items, req.body.ids)
    .then(handleQueryResult.bind(null, res), function (err) {
       res.status(400).send(err);
    });

});



module.exports = router;
var express = require('express');
var fs = require('fs');
var router = express.Router();
var LocalGameStorage = require('../model/LocalGameStorage');

function filterEjs(file) {
    if (~file.indexOf('.ejs')) {
        return file.slice(0, -4);
    }
}
function filterFalse (el) {
    return el;
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
        rus: 'Члены клуба'
    },{
        page: 'hall_of_fame',
        rus: 'Зал Славы',
        periods: [{
            name: 'Осень 2015',
            players:[{
                nick: 'Earl Gray',
                imgName: 'earl_gray',
                avr: 2.68,
                gameNumber: 25,
                faculty: 'КНУ, Институт Филологии',
                experiance: 'Играет 3 месяца',
                honours: [{
                        title:'Лучший игрок Осени 2015',
                        type: 'season',
                        place: 1,
                }]
            },{
                nick: 'Клич',
                imgName: 'klich',
                avr: 2.48,
                gameNumber: 29,
                faculty: 'КНУ, Институт Высокий технологий',
                experiance: 'Играет 2 года',
                honours: [{
                        title:'Серебрянный призер Осени 2015',
                        type: 'season',
                        place: 2,
                }]
            },{
                nick: 'Phoenix',
                imgName: 'phoenix',
                avr: 2.10,
                gameNumber: 29,
                faculty: 'КНУ, Институт Инофрмационных технологий',
                experiance: 'Играет 9 месяцев',
                honours: [{
                        title:'Бронзовый призер Осени 2015',
                        type: 'season',
                        place: 3,
                }]
            }]
        },{
            name: 'Нобярь 2015',
            players:[{
                nick: 'Earl Gray',
                imgName: 'earl_gray',
                avr: 2.68,
                gameNumber: 25,
                faculty: 'КНУ, Институт Филологии',
                experiance: 'Играет 3 месяца',
                honours: [{
                        title:'Лучший игрок Осени 2015',
                        type: 'season',
                        place: 1,
                }]
            },{
                nick: 'Клич',
                imgName: 'klich',
                avr: 2.48,
                gameNumber: 29,
                faculty: 'КНУ, Институт Высокий технологий',
                experiance: 'Играет 2 года',
                honours: [{
                        title:'Серебрянный призер Осени 2015',
                        type: 'season',
                        place: 2,
                }]
            },{
                nick: 'Phoenix',
                imgName: 'phoenix',
                avr: 2.10,
                gameNumber: 29,
                faculty: 'КНУ, Институт Инофрмационных технологий',
                experiance: 'Играет 9 месяцев',
                honours: [{
                        title:'Бронзовый призер Осени 2015',
                        type: 'season',
                        place: 3,
                }]
            }]
        }]
    }];
console.log('pages = ', PAGES);


// ================ handlers for get PAGES ================ //
for (var i = 0; i < PAGES.length; i++) {
    (function(PAGES, i){
            console.log(PAGES[i]);
            router.get('/' + PAGES[i].page, function(req, res) {
                console.log('[ROUTER] get for' + PAGES[i], req.url);
                res.render(PAGES[i].page + '.ejs', {current: i, pages: PAGES});
            });
        })(PAGES, i);
};
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
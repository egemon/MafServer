var express = require('express');
var router = express.Router();
var LocalGameStorage = require('../model/LocalGameStorage');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('../public/MafTable/MafTable.html', {title:'Ilya'});
});

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
    console.log('req = ', req);
    console.log('req.data = ', req.body.games);
    LocalGameStorage.saveGameArray(req.body.games);
    var games = JSON.stringify(LocalGameStorage.getGamesByFilter('all'));
    res.send('Game Saved!');
});



module.exports = router;
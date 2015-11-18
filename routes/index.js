var express = require('express');
var router = express.Router();
var LocalGameStorage = require('../model/LocalGameStorage')
/* GET home page. */
router.get('/', function(req, res) {
    res.render('../public/MafTable/MafTable.html', {title:'Ilya'});
});

//getGamesByFilter
router.get('/sync', function (req, res) {
    console.log('sync get request taken!');
    var filterObject = req.query.filterObject;
    console.log('req.data = ', filterObject);

    console.log('LocalGameStorage = ', LocalGameStorage);
    var games = JSON.stringify(LocalGameStorage.getGamesByFilter(JSON.parse(filterObject)));
    console.log('games = ', games);
    res.send(games);
})

//getGamesByFilter
router.post('/sync', function (req, res) {
    console.log('psync post request taken!');
    console.log('req.data = ', req.data);
    console.log('LocalGameStorage = ', LocalGameStorage);
    JSON.stringify(LocalGameStorage.saveGame(req.data));
    res.send('Game Saved!');
})



module.exports = router;